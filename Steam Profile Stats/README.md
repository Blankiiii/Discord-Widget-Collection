# Steam stats
## Widget Layout / sample data

<img width="946" height="478" alt="image" src="https://github.com/user-attachments/assets/031f8833-259f-4df9-b07a-98ffbdef95db" />

<img width="1115" height="927" alt="image" src="https://github.com/user-attachments/assets/69ee5b0f-e271-4760-8b2a-50398c4f312f" />
<img width="1108" height="198" alt="image" src="https://github.com/user-attachments/assets/8d6ed124-0487-4001-b894-164d0415c3de" />




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

