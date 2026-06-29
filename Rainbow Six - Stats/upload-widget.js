const { execFile } = require('child_process');
const path = require('path');

const { BOT_TOKEN, DISCORD_APP_ID, DISCORD_USER_ID } = require('./config.json');

function runIndexScript() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'index.js');
    execFile(process.execPath, [scriptPath, '--once'], { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`index.js execution failed: ${error.message}\n${stderr}`));
      }
      try {
        const json = JSON.parse(stdout.trim());
        resolve(json);
      } catch (parseError) {
        reject(new Error(`Failed to parse index.js output as JSON:\n${parseError.message}\nOutput:\n${stdout}`));
      }
    });
  });
}

async function uploadToDiscord(payload) {
  if (!BOT_TOKEN || !DISCORD_APP_ID || !DISCORD_USER_ID) {
    throw new Error('Missing DISCORD_APP_ID, DISCORD_USER_ID, or BOT_TOKEN in config.json');
  }

  const url = `https://discord.com/api/v9/applications/${DISCORD_APP_ID}/users/${DISCORD_USER_ID}/identities/0/profile`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord API error ${response.status}: ${text}`);
  }

  return response;
}

async function main() {
  console.log('Generating R6 widget JSON from index.js...');
  const payload = await runIndexScript();

  console.log('Uploading widget JSON to Discord...');
  await uploadToDiscord(payload);

  console.log('Upload complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
