import http from 'http';
import { URL } from 'url';
import { getNewAuthorizationToken, handleAuthCallback } from './providers/Authorization';
import storage from 'node-persist';
import dotenv from 'dotenv';
import { patchIdentity } from './providers/discord';
import { fetchSpotifyProfile } from './providers/spotify';
import { toIdentity } from './types/spotifyProfile';
dotenv.config();

const UPDATE_INTERVAL_MS = 24 * 3600 * 1000; // 24 hours

async function run() {
  const userID = process.env.DISCORD_USER_ID;
  if (!userID) {
    throw new Error('DISCORD_USER_ID is required.');
  }

  console.log('Fetching Spotify profile statistics...');
  const profile = await fetchSpotifyProfile();
  
  console.log('Map profile to Discord Identity...');
  const identity = toIdentity(profile);

  console.log('Patching Discord profile identity...');
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

/**
 * Handles checking/acquiring the Spotify auth token.
 * Resolves once authentication is confirmed.
 */
function ensureAuthentication(): Promise<void> {
  return new Promise(async (resolve) => {
    await storage.init();

    // 1. Try silent token retrieval
    const token = await getNewAuthorizationToken();
    if (token) {
      console.log("Success! Your fresh token is:", token);
      return resolve();
    }

    // 2. Fallback: Spin up auth callback receiver server
    console.log("Authentication required. Waiting for you to log in via your browser...");

    const server = http.createServer(async (req, res) => {
      const reqUrl = new URL(req.url ?? '', `http://${req.headers.host}`);
      const code = reqUrl.searchParams.get('code');

      if (code) {
        const accessToken = await handleAuthCallback(code);
        
        if (accessToken) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
              <h1 style="color: #1DB954;">Success!</h1>
              <p>Your Spotify account is linked. You can close this tab now and check your terminal.</p>
            </div>
          `);
          console.log("Authenticated successfully! Token saved.");
          
          // Shut down the temp server and let the main application proceed
          server.close(() => {
            resolve();
          });
        } else {
          res.writeHead(500);
          res.end("Failed to exchange code for token.");
        }
      } else {
        res.writeHead(404);
        res.end("No code found.");
      }
    });

    server.listen(8080, '127.0.0.1');
  });
}

// Main sequence controller
async function start() {
  try {
    // 1. Wait for authentication to succeed (either cached or freshly logged in)
    await ensureAuthentication();

    // 2. Run the first update cycle immediately
    console.log('Running initial profile sync...');
    await scheduleUpdate();

    // 3. Schedule updates for every 24 hours
    console.log(`Schedule configured. Updating every 24 hours...`);
    setInterval(scheduleUpdate, UPDATE_INTERVAL_MS);

  } catch (error) {
    console.error('FATAL: Application crashed during startup initialization:', error);
    process.exit(1);
  }
}

// Let's go!
start();