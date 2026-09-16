@echo off
rem ===========================================================================
rem run-proof-server.cmd -- keep the Midnight proof server alive on :6300.
rem
rem The proof server is a Linux binary (ledger/proof-server 8.1.0) executed in
rem the WSL1 distro "mnc". A `wsl -- bash -c "nohup ... &"` session DIES when
rem the launching wsl.exe exits, so this wrapper keeps one WSL session alive
rem from the Windows side: a hidden wsl.exe process runs `sleep infinity`
rem after starting the server -- the session (and the server) live as long as
rem that process does.
rem
rem Start detached:
rem   powershell -NoProfile -Command "Start-Process -WindowStyle Hidden ^
rem     cmd -ArgumentList '/c','%~dp0run-proof-server.cmd'"
rem
rem Stop: taskkill /FI "WINDOWTITLE eq hushpot-proof-server" (or kill wsl.exe)
rem ===========================================================================
title hushpot-proof-server
rem NOTE: run the .sh (not inline bash -c with the server name) -- an inline
rem `pkill -f midnight-proof-server` would match its own bash cmdline and
rem kill itself before nohup ever starts.
wsl -d mnc -u root -- bash -c "cd /mnt/c/Users/Sabiedu/.qwenpaw/workspaces/hack_1/hushpot-app && bash tools/run-proof-server.sh; echo [keep-alive] holding WSL session open; sleep infinity"
