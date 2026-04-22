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
                    const versions = await this.getDataFromProjectVersion(project.id);
                    console.log('versions',versions[0].version_number); 
                    console.log('versions',versions[0].changelog); 
                    console.log('url',`https://modrinth.com/modpack/${project.slug}`);
                    
                    newCache[project.id] = project.updated;
                    console.log(`Verificando atualizações para ${project.title}`);
                    
                    
                    // Novo projeto
                    if (!oldCache[project.id]) {
                        console.log('Novo');
                        const message = this.prepareMessage(project, versions[0], 'Novo');
                        await this.sendDiscord(message); 
                    }
                    
                    // Atualização
                    else if (oldCache[project.id] !== project.updated) {
                        console.log('Atualização');
                        const message = this.prepareMessage(project, versions[0], 'Update');
                        await this.sendDiscord(message); 
                    }
                }
                
                //   // Removidos
                for (const id in oldCache) {
                    if (!newCache[id]) { 
                        console.log(`Removido: ${id}`);
                        const message = this.prepareMessage(project, versions[0], 'Removed.');
                        await this.sendDiscord(message); 
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
            
            httpDiscord.post("", {
                content: message
            }).then(() => resolve({ success: true }))
            .catch(err => reject(err));
        });
    }

    prepareMessage(project, version, type) {
        return `[${type}] New update of the modpack: ${project.title}\n\n
🆕 New version of the modpack: ${project.title}\n
Version: ${version.version_number}\n
Changelog: ${version.changelog}\n
URL: https://modrinth.com/modpack/${project.slug}`;
    }   
    
}

module.exports = new ProjectService();