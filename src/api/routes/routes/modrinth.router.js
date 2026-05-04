
const controller = require("../../controllers/modrinthController");
const BaseRouter = require("../base.router");

class ModrinthRouter extends BaseRouter{
    
    constructor(controller){
        super(controller)
        this.prefix = '/modrinth'
    }

    init(){
        this.router.get(`${this.prefix}/project/:project`, this.controller.getDataFromProject.bind(this.controller));
        this.router.patch(`${this.prefix}/projects`, this.controller.getDataFromMultipleProjects.bind(this.controller));
        this.router.get(`${this.prefix}/project/:project/version`, this.controller.getDataFromProjectVersion.bind(this.controller));
        this.router.get(`${this.prefix}/check-updates`, this.controller.checkUpdates.bind(this.controller));
        this.router.get(`${this.prefix}/generate-message`, this.controller.generateMessage.bind(this.controller));
        return this.router
    }
}

module.exports = new ModrinthRouter( controller )