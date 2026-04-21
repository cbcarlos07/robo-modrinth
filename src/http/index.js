
const axios = require("axios");


const {TOKEN_MODRINTH, WEBHOOK_URL} = process.env;


const httpModrinth = axios.create({
    baseURL: `https://api.modrinth.com/v2/projects`,
    headers: {
        'Authorization': TOKEN_MODRINTH
    }
});

const httpDiscord = axios.create({
  baseURL: `https://discord.com/api/webhooks/${WEBHOOK_URL}`
});

module.exports = {
  httpModrinth,
  httpDiscord
}
