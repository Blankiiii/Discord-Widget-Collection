const { loadConfig } = require('./providers/config');
const { fetchRawR6Json } = require('./providers/r6data');
const { execFile } = require('child_process');
const path = require('path');

const RUN_ONCE = process.argv.includes('--once');
const INTERVAL_MS = 24 * 3600 * 1000; // Run once every 24 hours

const uploadScriptPath = path.join(__dirname, 'types', 'upload-widget.js');
let isRunning = false;

/**
 * Triggers the upload script and writes the payload to it.
 */
function triggerUpload(payload) {
  return new Promise((resolve) => {
    console.log(`${new Date().toISOString()} - [Upload] Starting upload-widget.js...`);

    const child = execFile(
      process.execPath,
      [uploadScriptPath],
      { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (stdout) {
          console.log(stdout.trim());
        }

        if (error) {
          console.error('[Upload] Execution failed:', error.message);
          if (stderr) {
            console.error(stderr.trim());
          }
        } else {
          console.log(`${new Date().toISOString()} - [Upload] Finished successfully.`);
        }
        resolve();
      }
    );

    // Write our R6 data to the upload script's standard input
    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

/**
 * The master sequence: Fetch first, then immediately upload.
 */
async function runSequence() {
  if (isRunning) {
    console.log('A sync sequence is already in progress. Skipping.');
    return;
  }

  isRunning = true;
  console.log(`\n=== Starting Sync Sequence: ${new Date().toISOString()} ===`);

  try {
    // 1. Pull the R6 data first
    console.log('[Step 1/2] Fetching fresh R6 data...');
    const config = loadConfig();
    const payload = await fetchRawR6Json(config);
    console.log('[R6 Data Payload Acquired]');

    // 2. Immediately run the upload script right after
    console.log('[Step 2/2] Data ready. Triggering widget upload...');
    await triggerUpload(payload);

  } catch (error) {
    console.error('[Sync Error] Sequence failed:', error);
  } finally {
    isRunning = false;
    console.log(`=== Sync Sequence Finished: ${new Date().toISOString()} ===\n`);
  }
}

// ==========================================
// Execution Controller
// ==========================================

if (RUN_ONCE) {
  runSequence();
} else {
  // Start the 24-hour loop
  const intervalId = setInterval(runSequence, INTERVAL_MS);

  process.on('SIGINT', () => {
    console.log('Stopping sync loop on Ctrl+C...');
    clearInterval(intervalId);
    process.exit(0);
  });

  // Run immediately on startup
  runSequence();
}

module.exports = { runSequence };