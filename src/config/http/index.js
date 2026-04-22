
const axios = require("axios");
const https = require('https');

const {TOKEN_MODRINTH, WEBHOOK_URL} = process.env;


const httpModrinth = axios.create({
  baseURL: `https://api.modrinth.com/v2`,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
    secureProtocol: 'TLSv1_2_method'
  }),
  headers: {
    'Authorization': TOKEN_MODRINTH
  }
});

const httpDiscord = axios.create({
  baseURL: `https://discord.com/api/webhooks/${WEBHOOK_URL}`,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true
  }),
});

module.exports = {
  httpModrinth,
  httpDiscord
}
