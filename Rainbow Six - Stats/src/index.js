const { loadConfig } = require('./providers/config');
const { fetchRawR6Json } = require('./providers/r6data');

const RUN_ONCE = process.argv.includes('--once');
const intervalMs = 10 * 60 * 1000;

async function runOnce() {
  try {
    const config = loadConfig();
    const payload = await fetchRawR6Json(config);
    console.log(JSON.stringify(payload));
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

if (RUN_ONCE) {
  runOnce();
} else {
  const intervalId = setInterval(runOnce, intervalMs);

  process.on('SIGINT', () => {
    console.log('Stopping on Ctrl+C...');
    clearInterval(intervalId);
    process.exit(0);
  });

  runOnce();
}

module.exports = { runOnce };
