const BaseController = require("./baseController");
const service = require("../../core/services/discordService");
class  DiscordController extends BaseController{

    constructor(_service){
        super(_service);
    }

    sendDiscord(req, res){
        const { message } = req.body;
        this.service.sendDiscord( message )
            .then(data => res.json(data))
            .catch(err => res.status(this.StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message}));
    }


}

module.exports = new DiscordController(service)