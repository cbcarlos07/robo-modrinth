

const cron = require("node-cron");
const { httpModrinth, httpDiscord } = require("./http");
const { saveCache, loadCache } = require("./utils/cache");

const projects = JSON.parse(process.env.PROJECTS_MODRINTH);
// Enviar mensagem para Discord
const sendDiscord = async (message) => {
  await httpDiscord.post("/", {
    content: message
  });

}

// Buscar projetos
const fetchProjects = async () => {
  const res = await httpModrinth.get("/",{
    ids: projects
  });
  return res.data;
}

// Verificar mudanças
const checkUpdates = async () => {
  const oldCache = loadCache();
  const projects = await fetchProjects();

  let newCache = {};

  for (const project of projects) {
    newCache[project.id] = project.updated;

    // Novo projeto
    if (!oldCache[project.id]) {
      await sendDiscord(`🆕 Novo modpack: ${project.title}`);
    }

    // Atualização
    else if (oldCache[project.id] !== project.updated) {
      await sendDiscord(`🔄 Modpack atualizado: ${project.title}`);
    }
  }

  // Removidos
  for (const id in oldCache) {
    if (!newCache[id]) {
      await sendDiscord(`❌ Modpack removido: ${id}`);
    }
  }

  saveCache(newCache);
}

// Rodar a cada 5 minutos
cron.schedule("1 0 * * *", () => {
  console.log("Verificando atualizações...");
  checkUpdates();
});