

const {DEFAULT_PWD, JWT_SECRET, DEFAULT_EMAIL} = process.env

const md5 = require('md5')
const jwt = require('jsonwebtoken');

class UserService {
    
    auth ( data ) {
        return new Promise(async(resolve, reject)=>{            
            const { email, password } = data
            
            if( email === DEFAULT_EMAIL && md5(password) === DEFAULT_PWD ){
                const token = jwt.sign( {email}, JWT_SECRET, { expiresIn: 60 * 60 * 24 }  )
                resolve({statusCode: 200, status: 'success', data: {email}, token, refreshToken: token, msg: 'Login bem-sucedido'})
                
            }else{
                reject({message: 'Login ou senha incorretos'})
            }
        })
    }
    

}

module.exports = new UserService()