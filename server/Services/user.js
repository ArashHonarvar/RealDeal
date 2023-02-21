"use strict"

const crypto = require('crypto');
const db = require('../Queries/user');

class User {

    async getUser(email, password) {
        
        let user = await db.getUser(email);

        if (user) {
            let salt = user.salt;

            return new Promise((resolve, reject) => {
                crypto.scrypt(password, salt, 64, (err, hashedPassword) => {
                    if (err) reject(err);
                    const passwordHex = Buffer.from(user.password, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false); 
                    else resolve(user);
                });
            })
        }
        else return undefined
    };

    async getUserById(id) {
        return db.getUserById(id)
    };

    async registerUser(data) {
        let salt = crypto.randomBytes(32).toString("base64");
        let hashedPassword = crypto.scryptSync(data.password, salt, 64).toString("hex");

        return db.newUser(data.email, hashedPassword, salt, data.type);
    };

    async addUserInfo(info, id) {
        return db.addUserInfo(info, id);
    };

    async addBusinessInfo(info, id) {
        return db.addBusinessInfo(info, id);
    };

    async getUserType(req, res) {
        let user_id = req.params.user_id;

        try {
            let userType = await db.getUserType(user_id);
            res.status(200).json(userType);
        } catch(err) {
            let message = "Server error"
            return res.status(503).json(message)
        }
    }

    async getUserInfo(req, res) {

        let id = req.params.userId;

        try {
            let info = await db.getUserInfo(id);
            res.status(200).json(info);
        } catch(err) {
            let message = "Server error"
            return res.status(503).json(message)
        }
    };

    async getBusinessInfo(req, res) {

        let id = req.params.userId;

        try {
            let info = await db.getBusinessInfo(id);
            res.status(200).json(info);
        } catch(err) {
            let message = "Server error"
            return res.status(503).json(message)
        }
    };

    async getCreatorImage(req, res) {
        let id = req.params.id;

        if(id <= 4) {
            try {
                let image = await db.getCreatorImage(id);
                res.status(200).json(image);
            } catch (err) {
                let message = "Server error"
                return res.status(503).json(message)
            }
        } else {
            let message = "Unauthorized"
            return res.status(401).json(message)
        }
        
    }

}

module.exports = User;