# Rainbow Six - Stats Widget
## Widget Layout
<img width="956" height="798" alt="image" src="https://github.com/user-attachments/assets/172db208-eed2-4ad7-a1b8-80f51b277ca3" />

## [TheCreativeGod's widget extension (import)](https://github.com/TheCreativeGod/Discord-Widgets-Extension)
```json
{"_type":"discord-widget","version":1,"display_name":"Rainbow Six - Stats","surfaces":{"widget_bottom":{"layout":"widget_bottom_stats","components":{"stat_5":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"most_Played_Attack","fallback":{"value_type":"custom_string","presentation_type":"text","value":"Unknown"}},"icon":{"value_type":"data","presentation_type":"image","value":"most_Played_Attack_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"Fallback_Operator_Attack"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Most Played Attacker"}}},"stat_6":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"most_Played_Defense","fallback":{"value_type":"custom_string","presentation_type":"text","value":"Unknown"}},"icon":{"value_type":"data","presentation_type":"image","value":"most_Played_Defense_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"Fallback_Operator_Defense"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Most Played Defense"}}},"stat_3":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"current_WR","fallback":{"value_type":"custom_string","presentation_type":"text","value":"0%"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Current WR"}}},"stat_2":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"max_Rank","fallback":{"value_type":"custom_string","presentation_type":"text","value":"Unranked"}},"icon":{"value_type":"data","presentation_type":"image","value":"max_Rank_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_rank"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Highest Rank"}}},"stat_4":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"current_KD","fallback":{"value_type":"custom_string","presentation_type":"text","value":"1"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Current KD"}}},"stat_1":{"fields":{"value":{"value_type":"data","presentation_type":"text","value":"current_Rank","fallback":{"value_type":"custom_string","presentation_type":"text","value":"Unranked"}},"icon":{"value_type":"data","presentation_type":"image","value":"current_Rank_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_rank"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Current Rank"}}}}},"mini_profile":{"layout":"mini_profile_hero_stat","components":{"stat":{"fields":{"text":{"value_type":"data","presentation_type":"text","value":"user_Name","fallback":{"value_type":"custom_string","presentation_type":"text","value":"-"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Stats for"}}},"hero_image":{"fields":{"image":{"value_type":"data","presentation_type":"image","value":"current_Rank_img","fallback":{"value_type":"application_asset","presentation_type":"image","value":"fallback_rank"}}}}}},"widget_top":{"layout":"widget_top_hero","components":{"title":{"fields":{"text":{"value_type":"custom_string","presentation_type":"text","value":"Rainbow Six - Ranked Stats"}}},"subtitle_1":{"fields":{"text":{"value_type":"data","presentation_type":"text","value":"user_Name","fallback":{"value_type":"custom_string","presentation_type":"text","value":"UNKNOWN"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Username"}}},"hero_image":{"fields":{"image":{"value_type":"application_asset","presentation_type":"image","value":"Hero_img"}}},"subtitle_2":{"fields":{"text":{"value_type":"data","presentation_type":"text","value":"user_Platform","fallback":{"value_type":"custom_string","presentation_type":"text","value":"UNKNOWN"}},"label":{"value_type":"custom_string","presentation_type":"text","value":"Platform"}}}}},"add_widget_preview":{"layout":"add_widget_preview_hero","components":{"hero_image":{"fields":{"image":{"value_type":"application_asset","presentation_type":"image","value":"Hero_img"}}}}},"activity_accessory":{"layout":"activity_accessory_stat","components":{"stat":{"fields":{"text":{"value_type":"custom_string","presentation_type":"text","value":"Made with love by Blank ♥️"}}}}}}}
```


## JSON
```json
{
  "data": {
    "dynamic": [
      {
        "type": 1,
        "name": "user_Name",
        "value": ""
      },
      {
        "type": 1,
        "name": "user_Platform",
        "value": ""
      },
      {
        "type": 1,
        "name": "current_Rank",
        "value": ""
      },
      {
        "type": 3,
        "name": "current_Rank_img",
        "value": {
          "url": "<URL to current_Rank_img.png>"
        }
      },
      {
        "type": 1,
        "name": "max_Rank",
        "value": ""
      },
      {
        "type": 3,
        "name": "max_Rank_img",
        "value": {
          "url": "<URL to max_Rank_img.png>"
        }
      },
      {
        "type": 1,
        "name": "current_WR",
        "value": ""
      },
      {
        "type": 1,
        "name": "current_KD",
        "value": ""
      },
      {
        "type": 1,
        "name": "most_Played_Attack",
        "value": ""
      },
      {
        "type": 3,
        "name": "most_Played_Attack_img",
        "value": {
          "url": "<URL to most_Played_Attack_img.png>"
        }
      },
      {
        "type": 1,
        "name": "most_Played_Defense",
        "value": ""
      },
      {
        "type": 3,
        "name": "most_Played_Defense_img",
        "value": {
          "url": "<URL to most_Played_Defense_img.png>"
        }
      }
    ]
  }
}
```

if you finished creating the widget you just put your information including an API key from [R6Data](https://r6data.com) into the config file and then you can just run the bat file to make it autorefresh every 10 minutes (because the api has a free limit of 2500 calls per month i advise to just put it up to 20-25 mins (average game length)).
you can change the time at the bottom of the index.js (```20 * 60 * 1000``` is 20 minutes, ```25 * 60 * 1000``` is 25 minutes)

```js
if (RUN_ONCE) {
  runOnce();
} else {
  const intervalMs = 10 * 60 * 1000;
  const intervalId = setInterval(runOnce, intervalMs);

  process.on('SIGINT', () => {
    console.log('Stopping on Ctrl+C...');
    clearInterval(intervalId);
    process.exit(0);
  });

  runOnce();
}
```


OKIDOKI HAVE FUN BYEEEEEEEE
