const { execFile } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'upload', 'upload-widget.js');
const intervalMs = 10 * 60 * 1000;
let running = false;

function runUploadWidget() {
  if (running) {
    console.log('Previous upload still running, skipping this interval.');
    return;
  }

  running = true;
  console.log(`${new Date().toISOString()} - Starting upload-widget.js`);

  execFile(process.execPath, [scriptPath], { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    running = false;

    if (stdout) {
      console.log(stdout.trim());
    }

    if (error) {
      console.error('upload-widget.js execution failed:', error.message);
      if (stderr) {
        console.error(stderr.trim());
      }
      return;
    }

    console.log(`${new Date().toISOString()} - upload-widget.js finished successfully.`);
  });
}

const intervalId = setInterval(runUploadWidget, intervalMs);

process.on('SIGINT', () => {
  console.log('Stopping upload-widget-loop...');
  clearInterval(intervalId);
  process.exit(0);
});

runUploadWidget();
