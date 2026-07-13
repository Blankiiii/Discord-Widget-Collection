export interface SteamProfile {
  steamId64: string;
  displayName: string;
  avatarFull: string;
  steamLevel: number;
  memberSinceYear: number;
  playtimePast2WHoursMinutes: string;
  playtimeHoursMinutes: string;
  friends: number;
  personaState: number;
  gamesOwned: number;
  mostPlayedGameDisplay: string;
}

export interface DiscordIdentityPayload {
  username: string;
  data: {
    dynamic: Array<{
      type: number;
      name: string;
      value: string | number | { url: string };
    }>;
  };
}

const personaStateLabels: Record<number, string> = {
  0: 'Offline',
  1: 'Online',
  2: 'Busy',
  3: 'Away',
  4: 'Snooze',
  5: 'Looking to Trade',
  6: 'Looking to Play'
};

export function toIdentity(profile: SteamProfile): DiscordIdentityPayload {
  const personaStateLabel = personaStateLabels[profile.personaState] ?? 'Unknown';

  return {
    username: profile.displayName,
    data: {
      dynamic: [
        { type: 1, name: 'personaname', value: profile.displayName },
        { type: 3, name: 'avatarfull', value: { url: profile.avatarFull } },
        { type: 1, name: 'steamid', value: profile.steamId64 },
        { type: 2, name: 'steamlevel', value: profile.steamLevel },
        { type: 1, name: 'membersince', value: profile.memberSinceYear },
        { type: 1, name: 'playtimepast2w', value: profile.playtimePast2WHoursMinutes },
        { type: 1, name: 'playtime', value: profile.playtimeHoursMinutes },
        { type: 2, name: 'gamesowned', value: profile.gamesOwned },
        { type: 2, name: 'friends', value: profile.friends },
        { type: 1, name: 'personastate', value: personaStateLabel },
        { type: 1, name: 'mostplayedgame', value: profile.mostPlayedGameDisplay },
      ]
    }
  };
}
