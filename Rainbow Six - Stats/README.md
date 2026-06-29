# Rainbow Six - Stats Widget

to actually use and or create a Widget i advise you either follow [chloecinders](https://chloecinders.com/blog/discord-widgets#application-identities) or [aamiaa's](https://gist.github.com/aamiaa/7cdd590e3949cd654758bc90bcb4710b) tutorial or you join the discord previews server and look into the [widget channels](https://discord.com/channels/603970300668805120/1520833094154719404)

<img width="956" height="798" alt="image" src="https://github.com/user-attachments/assets/172db208-eed2-4ad7-a1b8-80f51b277ca3" />


after that dont forget to make the sample data required for it to run, this is what your sample data should be.:
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

otherwise if you already have one created you just put your information including an API key from [R6Data](https://r6data.com) into the config file and then you can just run the bat file to make it autorefresh every 10 minutes (because the api has a free limit of 2500 calls per month i advise to just put it up to 20-25 mins (average game length)).
you can change the time at the bottom of the index.js (20*60*1000 is 20 minutes, 25*60*1000 is 25 minutes)

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
