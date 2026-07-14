import dotenv from 'dotenv';

dotenv.config();

import { patchIdentity } from './providers/discord';
import { fetchSteamProfile } from './providers/steam';
import { toIdentity } from './types/steamprofile';

async function run() {
  const userID = process.env.DISCORD_USER_ID;
  if (!userID) {
    throw new Error('DISCORD_USER_ID is required.');
  }

  const profile = await fetchSteamProfile(process.env.STEAM_ID ?? process.env.STEAM_USER_ID);
  const identity = toIdentity(profile);

  await patchIdentity(identity, userID);
}

const scheduleUpdate = async () => {
  try {
    await run();
    console.log('Discord profile updated successfully.');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to update Discord profile:', message);
  }
};


scheduleUpdate();
setInterval(scheduleUpdate, 24*3600*1000); // Update every 24 hours