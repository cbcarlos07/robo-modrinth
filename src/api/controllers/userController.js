const BaseController = require("./baseController");
const service = require("../../core/services/userService");
class  UserService extends BaseController{

    constructor(_service){
        super(_service);
    }

    auth(req, res){
        this.service.auth(req.body)
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }


}

module.exports = new UserService(service)