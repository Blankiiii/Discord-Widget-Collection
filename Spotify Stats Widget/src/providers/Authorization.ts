import dotenv from 'dotenv';
import storage from 'node-persist'; // Node-safe localStorage alternative

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID ?? "YOUR_CLIENT_ID";
const redirectUri = 'http://127.0.0.1:8080';
const scope = 'user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private';


// Initialize storage

let isStorageInitialized = false;
async function initStorage() {
  if (!isStorageInitialized) {
    await storage.init();
    isStorageInitialized = true;
  }
}


// PKCE HELPER FUNCTIONS

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}


// AUTHORIZATION FLOW (LOG IN)

export async function redirectToSpotifyAuth(): Promise<void> {
  await initStorage();
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Store verifier locally on Node system
  await storage.setItem('code_verifier', codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  console.log("Please visit this URL to log in and authorize your app:");
  console.log(authUrl.toString());
}

export async function handleAuthCallback(code: string): Promise<string | null> {
  await initStorage();
  const codeVerifier = (await storage.getItem('code_verifier')) ?? "";
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  try {
    const response = await fetch(url, payload);
    const data = await response.json();

    if (data.access_token) {
      await storage.setItem('access_token', data.access_token);
      
      if (data.refresh_token) {
        await storage.setItem('refresh_token', data.refresh_token);
      }
      return data.access_token;
    }
  } catch (error) {
    console.error("Failed to retrieve initial token:", error);
  }
  return null;
}


// AUTOMATIC TOKEN RENEWAL

export async function getNewAuthorizationToken(): Promise<string | null> {
  await initStorage();
  const refreshToken = await storage.getItem('refresh_token');

  if (!refreshToken) {
    console.warn("No refresh token found. You need to authenticate first!");
    await redirectToSpotifyAuth();
    return null;
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };

  try {
    const response = await fetch(url, payload);
    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'invalid_grant') {
        console.error("Refresh token expired or invalid. Discarding credentials.");
        await storage.removeItem('refresh_token');
        await storage.removeItem('access_token');
        await redirectToSpotifyAuth();
      }
      return null;
    }

    if (data.access_token) {
      await storage.setItem('access_token', data.access_token);
      
      if (data.refresh_token) {
        await storage.setItem('refresh_token', data.refresh_token);
      }
      
      return data.access_token;
    }
  } catch (error) {
    console.error("Error refreshing Spotify access token:", error);
  }
  
  return null;
}