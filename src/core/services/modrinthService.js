const { httpModrinth, httpDiscord } = require("../../config/http");
const { saveCache, loadCache } = require("../../utils/cache");
const PROJECT = process.env.PROJECTS_MODRINTH;
class ProjectService {
    
    getDataFromMultipleProjects(projects) {        
        return new Promise(async (resolve, reject) => {
            const res = await httpModrinth.get(
                `/projects`,
                {
                    params: {
                        ids: JSON.stringify(projects)
                    }
                }
            );
            resolve(res.data);
        })
    }

    getDataFromProject(project) {
        return new Promise(async (resolve, reject) => {
            const res = await httpModrinth.get(
                `/projects/${project}`
            );
            resolve(res.data);
        })
    }
    getDataFromProjectVersion(project) {
        return new Promise(async (resolve, reject) => {
            const res = await httpModrinth.get(
                `/project/${project}/version`
            );
            resolve(res.data);
        })
    }

    fetchProjects(){
        return new Promise(async(resolve, reject) => {
            const res = await this.getDataFromMultipleProjects( JSON.parse( PROJECT ) );
            resolve(res);
        });
    }
    
    checkUpdates() {
        return new Promise(async(resolve, reject) => {
            const oldCache = loadCache();
            const projects = await this.fetchProjects();
            let newCache = {};
            for (const project of projects) {
                newCache[project.id] = project.updated;
                console.log(`Verificando atualizações para ${project.title}`);
                
                
                // Novo projeto
                if (!oldCache[project.id]) {
                  //await this.sendDiscord(`🆕 Novo modpack: ${project.title}`);
                }
                
                // // Atualização
                // else if (oldCache[project.id] !== project.updated) {
                //   await this.sendDiscord(`🔄 Modpack atualizado: ${project.title}`);
                // }
            }
            
            //   // Removidos
            for (const id in oldCache) {
            // if (!newCache[id]) { 
            //   await this.sendDiscord(`❌ Modpack removido: ${id}`);
            // }
            }

            saveCache(newCache);

            resolve(newCache)
        });
    }

    sendDiscord(message) {
        return new Promise(async(resolve, reject) => {
            await httpDiscord.post("/", {
                content: message
            });
            resolve();
        });
    }
    
}

module.exports = new ProjectService();