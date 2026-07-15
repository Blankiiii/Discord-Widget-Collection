import dotenv from 'dotenv';
import { getNewAuthorizationToken } from './Authorization';
import { spotifyProfile } from '../types/spotifyProfile';

dotenv.config();


// API RESPONSE TYPES

interface SpotifyUserResponse {
  display_name: string;
  images?: Array<{ url: string }>;
  followers?: { total: number };
}

interface SpotifyPlaylistsResponse {
  items: Array<{ public: boolean }>;
}

interface SpotifyTopArtistsResponse {
  items: Array<{
    name: string;
  }>;
}

interface SpotifyTopTracksResponse {
  items: Array<{
    name: string;
    artists: Array<{ name: string }>;
  }>;
}

interface SpotifyRecentlyPlayedResponse {
  items: Array<{
    track: { duration_ms: number };
    played_at: string;
  }>;
}

interface SpotifyLibraryResponse {
  total: number;
}

interface SpotifyApiResponses {
  user: SpotifyUserResponse;
  playlists: SpotifyPlaylistsResponse;
  topArtistsShort: SpotifyTopArtistsResponse;
  topTracksShort: SpotifyTopTracksResponse;
  topArtistsLong: SpotifyTopArtistsResponse;
  topTracksLong: SpotifyTopTracksResponse;
  recent: SpotifyRecentlyPlayedResponse;
  library: SpotifyLibraryResponse;
}


// ENDPOINTS

const ENDPOINTS = {
  user: 'me',
  playlists: 'me/playlists?limit=50',
  topArtistsShort: 'me/top/artists?limit=5&time_range=short_term', 
  topTracksShort: 'me/top/tracks?limit=5&time_range=short_term',   
  topArtistsLong: 'me/top/artists?limit=1&time_range=long_term',   
  topTracksLong: 'me/top/tracks?limit=1&time_range=long_term',     
  recent: 'me/player/recently-played?limit=50',
  library: 'me/tracks?limit=1'
};


// CORE FETCH FUNCTION

export const fetchSpotifyProfile = async (): Promise<spotifyProfile> => {
  const accessToken = await getNewAuthorizationToken(); 
  if (!accessToken) {
    throw new Error('Failed to retrieve a valid Spotify access token.');
  }

  const results = await Promise.all(
    Object.entries(ENDPOINTS).map(async ([key, endpoint]) => {
      const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API endpoint ${response.url} failed: ${response.status}`);
      }

      const data = await response.json();
      return [key, data] as const;
    })
  );

  const {
    user,
    playlists,
    topArtistsShort,
    topTracksShort,
    topArtistsLong,
    topTracksLong,
    recent,
    library
  } = Object.fromEntries(results) as SpotifyApiResponses;

  const publicPlaylists = playlists.items?.filter((p) => p?.public).length ?? 0;

  const obsessionTrack = topTracksShort.items?.[0];
  const currentObsession = obsessionTrack 
    ? `${obsessionTrack.name} - ${obsessionTrack.artists?.[0]?.name ?? 'Unknown'}` 
    : 'None';

  const heavyRotation = topArtistsShort.items?.[0]?.name ?? 'None';
  const allTimeFavourite = topArtistsLong.items?.[0]?.name ?? 'None';

  const lifeTrack = topTracksLong.items?.[0];
  const soundtrackOfMyLife = lifeTrack 
    ? `${lifeTrack.name} - ${lifeTrack.artists?.[0]?.name ?? 'Unknown'}` 
    : 'None';

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentPlaytimeMs = recent.items
    .filter((item) => item && new Date(item.played_at).getTime() > oneDayAgo)
    .reduce((sum, item) => sum + (item.track?.duration_ms ?? 0), 0);
  
  const minutesListened = Math.round(recentPlaytimeMs / 60000);
  const yesterdaysVibe = `${minutesListened} Minutes`;

  const librarySize = typeof library.total === 'number' 
    ? `${library.total.toLocaleString()} Songs` 
    : '0 Songs';

  return {
    userName: user.display_name ?? 'Unknown',
    ImgUrl: user.images?.[0]?.url ?? '',
    followerCount: user.followers?.total ?? 0,
    publicPlaylistCount: publicPlaylists,
    currentObsession,
    heavyRotation,
    allTimeFavourite,
    soundtrackOfMyLife,
    yesterdaysVibe,
    librarySize
  };
};