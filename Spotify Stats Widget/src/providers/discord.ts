import axios from 'axios';
import dotenv from 'dotenv';
import type { DiscordIdentityPayload } from '../types/spotifyProfile';

dotenv.config();

export async function patchIdentity(identity: DiscordIdentityPayload, userID: string) {
  const applicationId = process.env.APP_ID;
  const token = process.env.DISCORD_TOKEN;

  if (!applicationId || !token) {
    throw new Error('APP_ID and DISCORD_TOKEN must be set.');
  }

  const discordAPI = axios.create({
    baseURL: 'https://discord.com/api/v10',
    headers: {
      Authorization: `Bot ${token}`
    }
  });

  try {
    return await discordAPI.patch(
      `/applications/${applicationId}/users/${userID}/identities/0/profile`,
      identity,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`ERROR Discord API Patch failed: ${message}`);

    if (axios.isAxiosError(error) && error.response) {
      console.error('ERROR Status:', error.response.status, '| Data:', JSON.stringify(error.response.data, null, 2));
    }

    throw error;
  }
}