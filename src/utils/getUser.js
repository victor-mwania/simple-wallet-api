const jwt = require('jsonwebtoken');


const { APP_SECRET } = require('./config');

function getTokenPayload(token){
    return jwt.verify(token, APP_SECRET);
}

function getUser(req) {
    if(req){
        const authHeader = req.headers.authorization;

        if(authHeader){
            const token = authHeader.replace('Bearer ', "");

            return getTokenPayload(token);
        }
    }
}

module.exports = getUser