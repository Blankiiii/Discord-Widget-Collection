# Steam stats
## Widget Layout / sample data

<img width="946" height="478" alt="image" src="https://github.com/user-attachments/assets/031f8833-259f-4df9-b07a-98ffbdef95db" />

<img width="1132" height="997" alt="image" src="https://github.com/user-attachments/assets/46ccbace-5f0f-4a42-b905-a5a9ad8cefaa" />

<img width="1134" height="539" alt="image" src="https://github.com/user-attachments/assets/abbf6e9a-a392-4d61-af8d-24123b7ee0cb" />


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

