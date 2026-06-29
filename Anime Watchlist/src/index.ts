import dotenv from 'dotenv'
dotenv.config();
import { patchIdentity } from "./providers/discord";
import { toIdentity } from "./providers/getJson";


async function run() {
  const userID = process.env.DISCORD_USER_ID!;

  const input = {
    anime_watched: process.env.ANIME_WATCHED ?? "",
    nr1_anime: process.env.NR1_ANIME ?? "",
    nr1_anime_img: process.env.NR1_ANIME_IMG ?? "",
    nr2_anime: process.env.NR2_ANIME ?? "",
    nr2_anime_img: process.env.NR2_ANIME_IMG ?? "",
    nr3_anime: process.env.NR3_ANIME ?? "",
    nr3_anime_img: process.env.NR3_ANIME_IMG ?? ""
  };

  const identity = JSON.stringify(toIdentity(input));
  console.log("Identity to patch:", identity);

  await patchIdentity(identity, userID);
}

run();