const { tr } = require("date-fns/locale");
const { httpModrinth, httpDiscord } = require("../../config/http");

const { saveCache, loadCache } = require("../../utils/cache");
const discordService = require("./discordService");
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
            console.log('PROJECT',PROJECT);
            
            try {
                const res = await this.getDataFromMultipleProjects( JSON.parse( PROJECT ) );
                resolve(res);
            } catch (error) {
                reject(error)   
            }
        });
    }

    prepareObject(){
        return new Promise(async(resolve, reject) => {
            const projects = await this.fetchProjects();
            const versions = await this.getDataFromProjectVersion(projects[0].id);  
            const message = this.prepareMessage(projects[0],versions[0].version_number, 'New');   
            resolve(message);
        });
    }

    testMessage(){
        return new Promise(async(resolve, reject) => {
            const message = await this.prepareObject()
            await discordService.sendDiscord(message); 
            resolve(message);
        });
    }
    
    generateMessage() {
        return new Promise(async (resolve, reject) => {
            const message = await this.prepareObject()
            resolve(message);
        })
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
                        const message = this.prepareMessage(project, versions[0], 'New');
                        await discordService.sendDiscord(message); 
                    }
                    
                    // Atualização
                    else if (oldCache[project.id] !== project.updated) {
                        console.log('Atualização');
                        const message = this.prepareMessage(project, versions[0], 'Update');
                        await discordService.sendDiscord(message); 
                    }
                }
                
                //   // Removidos
                for (const id in oldCache) {
                    if (!newCache[id]) { 
                        console.log(`Removido: ${id}`);
                        const message = this.prepareMessage(project, versions[0], 'Removed.');
                        await discordService.sendDiscord(message); 
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
    
   

    prepareMessage(project, version, type) {
        return `> [${type}] New update of the modpack: ${project.title}
🆕 @everyone New version of the modpack: ${project.title}\n
**Version**: ${version.version_number}\n
**Changelog**:\n${version.changelog}\n
URL: [Download NOW the new version of the modpack!](https://modrinth.com/modpack/${project.slug})`;
    }   
    
}

module.exports = new ProjectService();