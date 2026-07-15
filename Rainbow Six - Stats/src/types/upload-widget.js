const fs = require('fs');
const path = require('path');

function readDiscordConfig() {
  const configPath = path.resolve(__dirname, '..', '..', 'config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return {
      BOT_TOKEN: process.env.BOT_TOKEN || config.BOT_TOKEN,
      DISCORD_APP_ID: process.env.DISCORD_APP_ID || config.DISCORD_APP_ID,
      DISCORD_USER_ID: process.env.DISCORD_USER_ID || config.DISCORD_USER_ID
    };
  }

  return {
    BOT_TOKEN: process.env.BOT_TOKEN,
    DISCORD_APP_ID: process.env.DISCORD_APP_ID,
    DISCORD_USER_ID: process.env.DISCORD_USER_ID
  };
}

const { BOT_TOKEN, DISCORD_APP_ID, DISCORD_USER_ID } = readDiscordConfig();

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

// Read the payload passed from index.js via stdin
async function main() {
  const payloadString = fs.readFileSync(0, 'utf-8'); // 0 is stdin descriptor
  if (!payloadString.trim()) {
    throw new Error('No payload received from index.js via stdin.');
  }

  const payload = JSON.parse(payloadString);
  console.log('Uploading widget JSON to Discord...');
  await uploadToDiscord(payload);
  console.log('Upload complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});