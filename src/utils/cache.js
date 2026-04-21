const fs = require("fs");

const CACHE_FILE = "./cache.json";
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