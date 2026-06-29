import axios from "axios";

// Discord Bot Token, Application ID, and User ID here
const discordAppToken = "";
const discordApplicationId = "";
const discordUserId = "";

const JSONString = {

}



// rest is code

const discordAPI = axios.create({
  baseURL: "https://discord.com/api/v10",
  headers: {
    "Authorization": "Bot " + discordAppToken,
  }
});


const identity = JSON.stringify(JSONString);


export async function patchIdentity(identity, discordUserId) {
  try {
    await discordAPI.patch(
      `/applications/${discordApplicationId}/users/${discordUserId}/identities/0/profile`,
      identity,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error(`ERROR Discord API Patch failed: ${error.message}`);
    if (error.response) {
      console.error(`ERROR Status: ${error.response.status} | Data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

await patchIdentity(identity, discordUserId);