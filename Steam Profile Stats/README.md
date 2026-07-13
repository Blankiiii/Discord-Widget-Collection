# Steam stats
## Widget Layout / sample data

<img width="946" height="478" alt="image" src="https://github.com/user-attachments/assets/031f8833-259f-4df9-b07a-98ffbdef95db" />

<img width="1133" height="926" alt="image" src="https://github.com/user-attachments/assets/b3c5f583-7fb0-483c-80c6-f2bf6f46bdf6" />
<img width="1123" height="273" alt="image" src="https://github.com/user-attachments/assets/bdfc5a0e-222d-4fb3-a935-686c253b6154" />



## JSON 
```ts
{
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
        { type: 1, name: 'simpleurl', value: profile.simpleUrl }
      ]
    }
  }
```

## Instructions

1. create the widget and add user data to the widget objects ofc
2. fill in your information into the .env file, including discord bot token from your widget, app_id and your user id, as well as your [steamid](https://steamid.io/lookup/) and [steamapi key](https://steamcommunity.com/dev/apikey)
3. start the bat file and enjoy

