const { httpDiscord } = require("../../config/http");
const { WEBHOOK_DISCORD }  = process.env;
class DiscordService {

     sendDiscord(message) {
        return new Promise(async(resolve, reject) => {
            
            httpDiscord.post(`/${WEBHOOK_DISCORD}`, {
                content: message
            }).then(() => resolve({ success: true }))
            .catch(err => reject(err));
        });
    }
}

module.exports = new DiscordService();