# Anime Watchlist
## Widget Layout

<img width="953" height="449" alt="image" src="https://github.com/user-attachments/assets/d5d1502b-9ba2-488a-922f-54ed35211ecb" />

## Credits
Idea from shxdow.v1 on Discord

## JSON 
```JSON
{
  "data": {
    "dynamic": [
      {
        "type": 1,
        "name": "anime_watched",
        "value": "220+ Animes"
      },
      {
        "type": 1,
        "name": "nr1_anime",
        "value": "That Time I Got Reincarnated As a Slime"
      },
      {
        "type": 1,
        "name": "nr2_anime",
        "value": "Witch Hat Atelier"
      },
      {
        "type": 1,
        "name": "nr3_anime",
        "value": "The Apothecary Diaries"
      }
    ]
  }
}
```

## Instructions

1. create the widget and use Application Assets for the Images, since i am not making a script to put stuff in rn

2. get the JSON up top filled with your information like the amount of anime you watched, nr1 anime etc (as in like a ranking)

3. follow  Dziurwa's help on how to fix the "this widget is still syncing [(original discord message)](https://discord.com/channels/603970300668805120/1520804143764078783):

        You need to run the application identity script (https://chloecinders.com/blog/discord-widgets#application-identities step)

        PowerShell
        curl -X PATCH "https://discord.com/api/v9/applications/{APPLICATION ID}/users/{DiscordUserId}/identities/0/profile" -H "Content-Type: application/json" -H "Authorization: Bot {BOT TOKEN}" -H "User-Agent: DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)" -d 'JSON DATA' 

        If your JSON body string has any apostrophes in it, (ex. "don't"), do a double apostrophe.

        don't → don''t

        Run that, change json string with the json string u got from sample data, change the DiscordUserId with your own discord user id, change bot token with ur application's token and change discord application id with ur application 
