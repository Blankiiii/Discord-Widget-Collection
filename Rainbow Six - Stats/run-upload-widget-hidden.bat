@echo off
cd /d "%~dp0"
start "" /min cmd /c "node src/types/upload-widget-loop.js"
