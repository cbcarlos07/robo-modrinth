const BaseController = require("./baseController");
const service = require("../../core/services/modrinthService");
class ModrinthController extends BaseController{

    constructor(_service){
        super(_service);
    }

    
    getDataFromProject(req, res){
        const {project} = req.params;
        this.service.getDataFromProject(project)
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }
    getDataFromMultipleProjects(req, res){
        const {ids} = req.body;   
        this.service.getDataFromMultipleProjects(ids)
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }
    
    getDataFromProjectVersion(req, res){
        const {project} = req.params;   
        this.service.getDataFromProjectVersion(project)
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }

    checkUpdates(req, res){   
        this.service.testMessage()
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }
}

module.exports = new ModrinthController(service)