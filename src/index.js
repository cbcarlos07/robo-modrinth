
// require('dotenv').config()

// const { CronJob } = require("cron");
// const {format} = require("date-fns");
// const { httpModrinth, httpDiscord } = require("./config/http");
// const { saveCache, loadCache } = require("./utils/cache");

// const PROJECT = process.env.PROJECTS_MODRINTH;



// // Enviar mensagem para Discord
// const sendDiscord = async (message) => {
//   await httpDiscord.post("/", {
//     content: message
//   });

// }

// // Buscar projetos
// const fetchProjects = async () => {
//   const res = await httpModrinth.get(
//     `/projects`,
//     {
//       params: {
//         ids: JSON.stringify([PROJECT])
//       }
//     }
//   );
//   return res.data;
// }

// // Verificar mudanças
// const checkUpdates = async () => {
//   const oldCache = loadCache();
//   const projects = await fetchProjects();

//   let newCache = {};

//   for (const project of projects) {
//     newCache[project.id] = project.updated;
    
//     // Novo projeto
//     // if (!oldCache[project.id]) {
//     //   await sendDiscord(`🆕 Novo modpack: ${project.title}`);
//     // }

//     // // Atualização
//     // else if (oldCache[project.id] !== project.updated) {
//     //   await sendDiscord(`🔄 Modpack atualizado: ${project.title}`);
//     // }
//   }

//   // Removidos
//   for (const id in oldCache) {
//     // if (!newCache[id]) { 
//     //   await sendDiscord(`❌ Modpack removido: ${id}`);
//     // }
//   }

//   saveCache(newCache);
// }

// // Rodar a cada 5 minutos

// const job = new CronJob("*/1 * * * *", () => {
//   const now = format(new Date(), "HH:mm:ss");
//   console.log(`Verificando atualizações... ${now}`);
//   checkUpdates();
// }, null, true, "America/Sao_Paulo");

// job.start();

require('dotenv').config()
const server = require('./server/server')

const SERVER_PORT = process.env.SERVER_PORT

server.listen(SERVER_PORT, () => {
    console.log(`API is running on [port ${SERVER_PORT}]`);
  });