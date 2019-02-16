"use strict";

function ExtractJwt (req) {
    let token = null;
    if(req.cookies && req.cookies.token != void(0)) token = req.cookies['token'];
    return token;
}

module.exports = {
    jwtKey: {
        jwtFromRequest: ExtractJwt,
        secretOrKey: 'TfbTq2NfLzqMcbVY9EpGQ2p'
    },

    serverPort: 3000,

    db: {
        url: "mongodb://admin1:admin1@ds211865.mlab.com:11865/project"
    },


    expiresIn: '1 day'
};