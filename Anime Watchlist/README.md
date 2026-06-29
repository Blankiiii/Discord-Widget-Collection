# Anime Watchlist
## Widget Layout / sample data

<img width="953" height="449" alt="image" src="https://github.com/user-attachments/assets/d5d1502b-9ba2-488a-922f-54ed35211ecb" />

<img width="1128" height="947" alt="image" src="https://github.com/user-attachments/assets/3bc98877-8ea2-4c22-afc3-2acf3da51135" />


## Credits
Idea from shxdow.v1 on Discord
Code inspiration by kaxtusik on github

## JSON 
```JSON
{
  "data": {
    "dynamic": [
      {
        "type": 1,
        "name": "anime_watched",
        "value": "Amount of anime watched"
      },
      {
        "type": 1,
        "name": "nr1_anime",
        "value": "your #1 anime"
      },
      {
        "type": 3,
        "name": "nr1_anime_img",
        "value": {
          "url": "<URL to nr1_anime_img.png>"
        }
      },
      {
        "type": 1,
        "name": "nr2_anime",
        "value": "your #2 anime"
      },
      {
        "type": 3,
        "name": "nr2_anime_img",
        "value": {
          "url": "<URL to nr2_anime_img.png>"
        }
      },
      {
        "type": 1,
        "name": "nr3_anime",
        "value": "your #3 anime"
      },
      {
        "type": 3,
        "name": "nr3_anime_img",
        "value": {
          "url": "<URL to nr3_anime_img.png>"
        }
      }
    ]
  }
}
```

## Instructions

1. create the widget and add the sample data + assign it as user data to the widget objects ofc
2. fill in your information into the .env file, including discord bot token from your widget, app_id and your user id, and the information you want displayed, links must be present and reachable otherwise you'll get a fallback image or error
3. start the bat file and enjoy

