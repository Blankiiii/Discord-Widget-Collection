# Anime Watchlist
## Widget Layout / sample data

<img width="953" height="449" alt="image" src="https://github.com/user-attachments/assets/d5d1502b-9ba2-488a-922f-54ed35211ecb" />

<img width="1128" height="947" alt="image" src="https://github.com/user-attachments/assets/3bc98877-8ea2-4c22-afc3-2acf3da51135" />

## [TheCreativeGod's widget extension (import)](https://github.com/TheCreativeGod/Discord-Widgets-Extension)
```json
{"_type":"discord-widget","version":1,"display_name":"Anime Watchlist!","surfaces":{"widget_bottom":{"layout":"widget_bottom_collection","components":{"item_2":{"fields":{"description":{"value_type":"data","presentation_type":"text","value":"nr1_anime","fallback":{"value_type":"custom_string","presentation_type":"text","value":"fallback"}},"image":{"value_type":"data","presentation_type":"image","value":"nr1_anime_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_img"}},"name":{"value_type":"custom_string","presentation_type":"text","value":"#1 Anime"}}},"item_3":{"fields":{"description":{"value_type":"data","presentation_type":"text","value":"nr2_anime","fallback":{"value_type":"custom_string","presentation_type":"text","value":"fallback"}},"image":{"value_type":"data","presentation_type":"image","value":"nr2_anime_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_img"}},"name":{"value_type":"custom_string","presentation_type":"text","value":"#2 Anime"}}},"item_1":{"fields":{"description":{"value_type":"data","presentation_type":"text","value":"anime_watched"},"image":{"value_type":"application_asset","presentation_type":"image","value":"Crunchyroll_Logo"},"name":{"value_type":"custom_string","presentation_type":"text","value":"Watched:"}}},"item_4":{"fields":{"description":{"value_type":"data","presentation_type":"text","value":"nr3_anime","fallback":{"value_type":"custom_string","presentation_type":"text","value":"fallback"}},"image":{"value_type":"data","presentation_type":"image","value":"nr3_anime_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_img"}},"name":{"value_type":"custom_string","presentation_type":"text","value":"#3 Anime"}}}}},"mini_profile":{"layout":"mini_profile_hero_stat","components":{"stat":{"fields":{"text":{"value_type":"custom_string","presentation_type":"text","value":"Anime Watchlist!"}}},"hero_image":{"fields":{"image":{"value_type":"application_asset","presentation_type":"image","value":"thumb-1920-913097-removebg-preview__2_"}}}}},"widget_top":{"layout":"widget_top_hero","components":{"title":{"fields":{"text":{"value_type":"custom_string","presentation_type":"text","value":"“I finally know what ‘I love you’ means.”"}}},"subtitle_1":{"fields":{"text":{"value_type":"custom_string","presentation_type":"text","value":"- Violet Evergarden"}}},"hero_image":{"fields":{"image":{"value_type":"application_asset","presentation_type":"image","value":"thumb-1920-913097-removebg-preview__2_"}}}}},"add_widget_preview":{"layout":"add_widget_preview_hero","components":{"hero_image":{"fields":{"image":{"value_type":"application_asset","presentation_type":"image","value":"thumb-1920-913097-removebg-preview__2_"}}}}}}}
```


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

