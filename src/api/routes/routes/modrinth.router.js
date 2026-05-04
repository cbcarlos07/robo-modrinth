
const controller = require("../../controllers/modrinthController");
const BaseRouter = require("../base.router");

class ModrinthRouter extends BaseRouter{
    
    constructor(controller){
        super(controller)
        this.prefix = '/modrinth'
    }

    init(){
        this.router.get(`${this.prefix}/project/:project`, (req, res) => this.controller.getDataFromProject(req, res));
        this.router.patch(`${this.prefix}/projects`, (req, res) => this.controller.getDataFromMultipleProjects(req, res));
        this.router.get(`${this.prefix}/project/:project/version`, (req, res) => this.controller.getDataFromProjectVersion(req, res));
        this.router.get(`${this.prefix}/check-updates`, this.controller.checkUpdates.bind(this.controller));
        return this.router
    }
}

module.exports = new ModrinthRouter( controller )