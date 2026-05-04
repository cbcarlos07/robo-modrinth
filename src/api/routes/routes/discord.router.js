
const controller = require("../../controllers/discordController");
const BaseRouter = require("../base.router");

class DiscordRouter extends BaseRouter{
    
    constructor(controller){
        super(controller)
        this.prefix = '/discord';
    }

    init(){
        this.router.post(`${this.prefix}/send`, this.controller.sendDiscord.bind(this.controller));
        
        return this.router
    }
}

module.exports = new DiscordRouter( controller )