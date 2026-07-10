import dotenv from 'dotenv';
import type { SteamProfile } from '../types/steamprofile';

dotenv.config();

interface SteamPlayerSummaryResponse {
  players?: Array<{
    steamid?: string;
    personaname?: string;
    avatarfull?: string;
    profileurl?: string;
    timecreated?: number;
    personastate?: number;
  }>;
}

interface SteamLevelResponse {
  player_level?: number;
}

interface SteamFriendsResponse {
  friendslist?: {
    friends?: unknown[];
  };
}

interface SteamGamesResponse {
  game_count?: number;
  games?: Array<{
    name?: string;
    playtime_forever?: number;
    playtime_2weeks?: number;
  }>;
}

interface SteamRecentGamesResponse {
  games?: Array<{
    name?: string;
    playtime_2weeks?: number;
  }>;
}

interface SteamApiResponses {
  user: SteamPlayerSummaryResponse;
  level: SteamLevelResponse;
  friends: SteamFriendsResponse;
  games: SteamGamesResponse;
  recent: SteamRecentGamesResponse;
}

const getEndpoints = (steamId: string) => ({
  user: `ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamId}`,
  level: `IPlayerService/GetSteamLevel/v0001/?steamid=${steamId}`,
  friends: `ISteamUser/GetFriendList/v0001/?steamid=${steamId}&relationship=friend`,
  games: `IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=true&include_played_free_games=true`,
  recent: `IPlayerService/GetRecentlyPlayedGames/v0001/?steamid=${steamId}`
});

const formatPlaytime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const parseSimpleUrl = (profileUrl: string) => {
  try {
    return new URL(profileUrl).pathname.replace(/\/$/, '');
  } catch {
    return profileUrl;
  }
};

export const fetchSteamProfile = async (steamId?: string): Promise<SteamProfile> => {
  const resolvedSteamId = steamId ?? process.env.STEAM_ID ?? process.env.STEAM_USER_ID;
  if (!resolvedSteamId) {
    throw new Error('Steam ID is required. Set STEAM_ID or STEAM_USER_ID.');
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    throw new Error('STEAM_API_KEY is required.');
  }

  const endpoints = getEndpoints(resolvedSteamId);
  const results = await Promise.all(
    Object.entries(endpoints).map(async ([key, endpoint]) => {
      const response = await fetch(`https://api.steampowered.com/${endpoint}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`${response.url} failed: ${response.status}`);
      }

      const data = await response.json();
      return [key, data.response ?? data] as const;
    })
  );

  const { user, level, friends, games, recent } = Object.fromEntries(results) as SteamApiResponses;
  const player = user.players?.[0];
  const totalPlaytimeMinutes = (games.games ?? []).reduce((sum, game) => sum + (game.playtime_forever ?? 0), 0);
  const totalPlaytime2WeeksMinutes = (recent.games ?? []).reduce((sum, game) => sum + (game.playtime_2weeks ?? 0), 0);

  return {
    steamId64: player?.steamid ?? resolvedSteamId,
    displayName: player?.personaname ?? 'Unknown',
    avatarFull: player?.avatarfull ?? '',
    steamLevel: level.player_level ?? 0,
    memberSinceYear: player?.timecreated ? new Date(player.timecreated * 1000).getUTCFullYear() : 0,
    playtimePast2WHoursMinutes: formatPlaytime(totalPlaytime2WeeksMinutes),
    playtimeHoursMinutes: formatPlaytime(totalPlaytimeMinutes),
    friends: friends.friendslist?.friends?.length ?? 0,
    personaState: player?.personastate ?? 0,
    gamesOwned: games.game_count ?? 0,
    mostPlayedGameDisplay: recent.games?.[0]?.name ?? games.games?.[0]?.name ?? 'No recent games',
    simpleUrl: player?.profileurl ? parseSimpleUrl(player.profileurl) : ''
  };
};