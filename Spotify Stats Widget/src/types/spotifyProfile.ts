export interface spotifyProfile {
  userName: string;
  ImgUrl: string;
  followerCount: number;
  publicPlaylistCount: number;
  currentObsession: string;
  heavyRotation: string;
  allTimeFavourite: string;
  soundtrackOfMyLife: string;
  yesterdaysVibe: string;
  librarySize: string;
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

export function toIdentity(profile: spotifyProfile): DiscordIdentityPayload {
  return {
    username: profile.userName,
    data: {
        dynamic: [
            { "type": 3, "name": "ImgUrl", "value": { "url": profile.ImgUrl } },
            { "type": 1, "name": "userName", "value": profile.userName },
            { "type": 2, "name": "followerCount", "value": profile.followerCount },
            { "type": 2, "name": "publicPlaylistCount", "value": profile.publicPlaylistCount },
            { "type": 1, "name": "currentObsession", "value": profile.currentObsession },
            { "type": 1, "name": "heavyRotation", "value": profile.heavyRotation },
            { "type": 1, "name": "allTimeFavourite", "value": profile.allTimeFavourite },
            { "type": 1, "name": "soundtrackOfMyLife", "value": profile.soundtrackOfMyLife },
            { "type": 1, "name": "yesterdaysVibe", "value": profile.yesterdaysVibe },
            { "type": 1, "name": "librarySize", "value": profile.librarySize },
        ]
    }
  };
}