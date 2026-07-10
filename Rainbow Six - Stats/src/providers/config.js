const fs = require('fs');
const path = require('path');

function readConfigFallback() {
  const configPath = path.join(__dirname, '..', '..', 'config.json');
  if (!fs.existsSync(configPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function loadConfig() {
  const config = readConfigFallback();
  const iconsConfigPath = path.join(__dirname, '..', '..', 'icons.config.json');
  const iconsConfig = JSON.parse(fs.readFileSync(iconsConfigPath, 'utf8'));

  const API_KEY = process.env.API_KEY || config.API_KEY;
  const Player_Name = process.env.PLAYER_NAME || config.Player_Name;
  const Platform_Type = process.env.PLATFORM_TYPE || config.Platform_Type;
  const Platform_Family = process.env.PLATFORM_FAMILY || config.Platform_Family;

  if (!API_KEY || !Player_Name || !Platform_Type || !Platform_Family) {
    throw new Error('Missing required config values. Supply environment variables or a config.json file.');
  }

  return { API_KEY, Player_Name, Platform_Type, Platform_Family, iconsConfig };
}

module.exports = { loadConfig };
