"use strict"

const db = require('../Queries/userInterest');

class UserInterest {
    async getAllUserInterests(req, res) {
        try {
            let interests = await db.getAllUserInterests(req.user.id);
            res.status(200).json(interests);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async removeAllUserInterests(userID) {
        return db.removeAllUserInterests(userID);
    }

    async addUserInterest(userInterest) {
        return db.addUserInterest(userInterest);
    }
}

module.exports = UserInterest;