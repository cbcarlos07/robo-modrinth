const { httpModrinth } = require("../../config/http/http");
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
    getDataFromProjectVersion(version) {
        return new Promise(async (resolve, reject) => {
            httpModrinth.get(
                `/version/${version}`
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

    prepareObject(){
        return new Promise(async(resolve, reject) => {
            try {
                const projects = await this.fetchProjects();
                const versions = await this.getDataFromProjectVersion(projects[0].versions[ projects[0].versions.length - 1 ]);
                const message = this.prepareMessage(projects[0],versions, 'New');   
                resolve(message);
            } catch (error) {
                reject(error);
            }
        });
    }

    testMessage(){
        return new Promise(async(resolve, reject) => {
            try{
                const message = await this.prepareObject()
                await discordService.sendDiscord(message); 
                resolve(message);
            } catch (error) {
                reject(error);
            }
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
                    const versions = await this.getDataFromProjectVersion(project.versions[ project.versions.length - 1 ]);
                    console.log('versions',versions.id); 
                    console.log('versions',versions.version_number); 
                    console.log('versions',versions.changelog);
                    console.log('url',`https://modrinth.com/modpack/${project.slug}`);
                    
                    newCache[project.id] = {
                        projectId: project.id, 
                        updated: project.updated,
                        version: project.versions
                    };
                    console.log(`Verificando atualizações para ${project.title}`);
                    
                    const newVersion = oldCache[project.id] && oldCache[project.id].version ?  oldCache[project.id].version.find(v => v === versions.id) : null;
                    
                    
                    // Novo projeto
                    if (!newVersion) {
                        console.log('Novo');
                        const message = this.prepareMessage(project, versions, 'New');
                        await discordService.sendDiscord(message); 
                    }else{
                        
                        
                        const deletedVersions = oldCache[project.id]?.version 
                                                        ? oldCache[project.id].version.filter(v => !project.versions.includes(v))
                                                        : [];

                        
                        if (deletedVersions.length > 0) {
                            console.log('Removido');
                            const message = this.prepareMessage(project, null, 'Removed');
                            await discordService.sendDiscord(message); 
                        }

                    }



                    
                }
                
                //   // Removidos
                // for (const id in oldCache) {
                //     if (!newCache[id]) { 
                //         console.log(`Removido: ${id}`);
                //         const message = this.prepareMessage(projects[0], versions, 'Removed.');
                //         await discordService.sendDiscord(message); 
                //     }
                // }
                console.log('newCache', newCache);
                saveCache(newCache);
                
                resolve(newCache)
            } catch (error) {
                console.log('checkUpdates error', error.message);
                reject(error);
            }
            
        });
    }
    
   

    prepareMessage(project, version, type) {
        return version ? `> [${type}] New update of the modpack: ${project.title}
🆕 @everyone New version of the modpack: ${project.title}
**Version**: ${version.version_number}
**Changelog**:
${version.changelog}
URL: [Download NOW the new version of the modpack!](https://modrinth.com/modpack/${project.slug})` 
: `**[${type}]** New update of the modpack: ${project.title}
🆕 @everyone 
URL: [Download NOW the new version of the modpack!](https://modrinth.com/modpack/${project.slug})`;

    }   
    
}

module.exports = new ProjectService();