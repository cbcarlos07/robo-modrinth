
const axios = require("axios");
const https = require('https');

const {TOKEN_MODRINTH, URL_MODRINTH, URL_DISCORD} = process.env;


const httpModrinth = axios.create({
  baseURL: URL_MODRINTH,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
    secureProtocol: 'TLSv1_2_method'
  }),
  headers: {
    'Authorization': TOKEN_MODRINTH
  }
});

const httpDiscord = axios.create({
  baseURL: URL_DISCORD,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true
  }),
});

module.exports = {
  httpModrinth,
  httpDiscord
}
