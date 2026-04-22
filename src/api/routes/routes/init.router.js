const { StatusCodes } = require("http-status-codes");
const BaseRouter = require("../base.router");
const pkg = require('../../../../package.json')
const userController = require("../../controllers/userController");

class InitRouter extends BaseRouter{
    constructor(){
        super()
    }
    
    init(){
        this.router.get(this.prefix, (req, res)=>{
            res.status(StatusCodes.OK)
               .json({
                description: pkg.description,
                name: pkg.name,
                version: pkg.version
               })
        })

        this.router.patch(`${this.prefix}auth`, userController.auth.bind(userController))

        return this.router
    }
}

module.exports = new InitRouter()