import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const discordApplicationId = process.env.APP_ID!;
const discordAPI = axios.create({
  baseURL: "https://discord.com/api/v10",
  headers: {
    "Authorization": "Bot " + process.env.DISCORD_TOKEN!
  }
});

export async function patchIdentity(identity: any, userID: string) {
  try {
    await discordAPI.patch(
      `/applications/${discordApplicationId}/users/${userID}/identities/0/profile`,
      identity,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error: any) {
    console.error(`ERROR Discord API Patch failed: ${error.message}`);
    if (error.response) {
      console.error(`ERROR Status: ${error.response.status} | Data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}