"use strict"

const db = require('../Queries/interest');

class Interest {
    async getAllInterests(req, res) {
        try {
            let interests = await db.getAllInterests();
            res.status(200).json(interests);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getInterestsByUserId(req, res) {

        let userId = req.params.userId;

        try {
            let interests = await db.getInterestsByUserId(userId);
            res.status(200).json(interests);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }
}

module.exports = Interest;