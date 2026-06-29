@echo off
cd /d "%~dp0"
start "" /min cmd /c "node upload-widget-loop.js"
