const { tr } = require("date-fns/locale");
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
            httpModrinth.get(
                `/project/${project}/version`
            ).then(res => resolve(res.data))
            .catch(err => reject(err));
        })
    }
    
    fetchProjects(){
        return new Promise(async(resolve, reject) => {
            try {
                const res = await this.getDataFromMultipleProjects( JSON.parse( PROJECT ) );
                resolve(res);
            } catch (error) {
                reject(error)   
            }
        });
    }
    
    checkUpdates() {
        return new Promise(async(resolve, reject) => {
            const oldCache = loadCache();
            try {
                const projects = await this.fetchProjects();
                let newCache = {};
                for (const project of projects) {
                    newCache[project.id] = project.updated;
                    console.log(`Verificando atualizações para ${project.title}`);
                    
                    
                    // Novo projeto
                    if (!oldCache[project.id]) {
                        console.log('Novo');
                        await this.sendDiscord(`🆕 Novo modpack: ${project.title}`);
                    }
                    
                    // Atualização
                    else if (oldCache[project.id] !== project.updated) {
                        console.log('Atualização');
                        await this.sendDiscord(`🔄 Modpack atualizado: ${project.title}`);
                    }
                }
                
                //   // Removidos
                for (const id in oldCache) {
                    if (!newCache[id]) { 
                        console.log(`Removido: ${id}`);
                        await this.sendDiscord(`❌ Modpack removido: ${id}`);
                    }
                }
                
                saveCache(newCache);
                
                resolve(newCache)
            } catch (error) {
                console.log('checkUpdates error', error);
                reject(error);
            }
            
        });
    }
    
    sendDiscord(message) {
        return new Promise(async(resolve, reject) => {
            
            httpDiscord.post("/", {
                content: message
            }).then(() => resolve({ success: true }))
            .catch(err => reject(err));
        });
    }
    
}

module.exports = new ProjectService();