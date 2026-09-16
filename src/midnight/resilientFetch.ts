// Resilient asset loading for flaky networks.
//
// Problem: the ledger WASM is ~10 MB in ONE file. On networks that reset
// long-lived responses (observed on some mobile/ISP links), a monolithic
// download dies mid-body with ERR_CONNECTION_RESET — the WASM compile aborts
// and the whole app fails to boot. Smaller transfers (the ~0.9 MB JS bundle)
// survive the same network fine.
//
// Fix: fetch large assets in 1 MB Range chunks with per-chunk retries and
// reassemble in memory. Each chunk is small enough to complete on a flaky
// link; a failed chunk retries instead of restarting the whole download.
// Applied both to WASM streaming compilation (patched below) and to ZK
// artifacts (zkAssets uses chunkedFetch).
//
// This module MUST be imported first in main.tsx so the streaming patch is
// installed before any midnight-js module body runs.

export interface ChunkedFetchOptions {
  /** Chunk size in bytes (default 1 MiB — small enough to survive resets). */
  chunkSize?: number;
  /** Max retries per chunk (default 6). */
  maxRetries?: number;
  /** Called with 0..1 after each successful chunk (progress UI hook). */
  onProgress?: (done: number, total: number) => void;
  /** Use chunking only above this size (default 2 MiB). */
  minSizeForChunking?: number;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Fetch a URL as an ArrayBuffer, using resumable Range chunks for large files. */
export async function chunkedFetch(
  url: string | URL,
  options: ChunkedFetchOptions = {},
): Promise<ArrayBuffer> {
  const {
    chunkSize = 1_048_576,
    maxRetries = 6,
    onProgress,
    minSizeForChunking = 2_097_152,
  } = options;
  const href = typeof url === 'string' ? url : url.toString();

  const head = await fetch(href, { method: 'HEAD' });
  if (!head.ok) throw new Error(`HEAD ${href}: HTTP ${head.status}`);
  const total = Number(head.headers.get('content-length') ?? 0);
  const acceptsRanges = (head.headers.get('accept-ranges') ?? '').includes('bytes');

  if (!total || !acceptsRanges || total <= minSizeForChunking) {
    // Small file or no range support: single fetch with bounded retries.
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await fetch(href);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.arrayBuffer();
      } catch (err) {
        if (attempt >= maxRetries) throw err;
        await sleep(400 * (attempt + 1));
      }
    }
  }

  const out = new Uint8Array(total);
  let done = 0;
  for (let off = 0; off < total; off += chunkSize) {
    const end = Math.min(off + chunkSize, total) - 1;
    let ok = false;
    for (let attempt = 0; attempt <= maxRetries && !ok; attempt++) {
      try {
        const res = await fetch(href, {
          headers: { Range: `bytes=${off}-${end}` },
          cache: 'no-store',
        });
        if (res.status !== 206 && res.status !== 200) {
          throw new Error(`chunk ${off}-${end}: HTTP ${res.status}`);
        }
        const part = new Uint8Array(await res.arrayBuffer());
        if (part.byteLength !== end - off + 1) {
          throw new Error(
            `chunk ${off}-${end}: short read ${part.byteLength} bytes`,
          );
        }
        out.set(part, off);
        ok = true;
      } catch (err) {
        if (attempt >= maxRetries) {
          throw new Error(
            `resilientFetch: chunk ${off}-${end} of ${href} failed after ${attempt + 1} attempts: ${String(err)}`,
          );
        }
        await sleep(400 * (attempt + 1));
      }
    }
    done = end + 1;
    onProgress?.(done, total);
    // Reflect progress on the static boot screen (replaced once React mounts).
    // deno-lint-ignore no-explicit-any
    const boot = (window as any).__hushpotProgress;
    if (typeof boot === 'function') {
      try {
        boot(done, total);
      } catch {
        /* boot screen is best-effort */
      }
    }
  }
  return out.buffer;
}

/**
 * Patch WebAssembly.instantiateStreaming / compileStreaming to route .wasm
 * URLs through chunkedFetch. Non-wasm (Response-less) sources fall through
 * to the native implementations.
 */
export function patchWasmStreaming(): void {
  const nativeInstantiate = WebAssembly.instantiateStreaming.bind(WebAssembly);
  const nativeCompile = WebAssembly.compileStreaming?.bind(WebAssembly);

  async function wasmBuffer(
    source: Response | Request | string | URL,
  ): Promise<ArrayBuffer | null> {
    let url: string | null = null;
    if (typeof source === 'string' || source instanceof URL) url = source.toString();
    else if (source instanceof Request) url = source.url;
    else if (source instanceof Response) {
      // The Response body may already be mid-flight from a fetch the caller
      // started; we cannot restart it — re-fetch the same URL in chunks.
      url = source.url || null;
    }
    if (!url || !url.split('?')[0].endsWith('.wasm')) return null;
    return chunkedFetch(url);
  }

  // deno-lint-ignore no-explicit-any
  (WebAssembly as any).instantiateStreaming = async (
    source: Response | Request | string | URL,
    // deno-lint-ignore no-explicit-any
    importObject?: any,
    // deno-lint-ignore no-explicit-any
  ): Promise<any> => {
    const buf = await wasmBuffer(source);
    if (buf === null) return nativeInstantiate(source as Response, importObject);
    return WebAssembly.instantiate(buf, importObject);
  };

  if (typeof WebAssembly.compileStreaming === 'function' && nativeCompile) {
    // deno-lint-ignore no-explicit-any
    (WebAssembly as any).compileStreaming = async (
      source: Response | Request | string | URL,
      // deno-lint-ignore no-explicit-any
    ): Promise<any> => {
      const buf = await wasmBuffer(source);
      if (buf === null) return nativeCompile(source as Response);
      return WebAssembly.compile(buf);
    };
  }
}
