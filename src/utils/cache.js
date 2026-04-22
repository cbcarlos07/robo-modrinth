const fs = require("fs");
const path = require("path");
const CACHE_FILE = path.resolve(__dirname, "..","..","public","cache.json");

// Carregar cache
const loadCache = () => {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE));
}

// Salvar cache
const saveCache = (data) => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}


module.exports = {
  loadCache,
  saveCache
}