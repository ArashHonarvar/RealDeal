"use strict";

const db = require('../Queries/friend');
const userDB = require('../Queries/user');
const interestDB = require('../Queries/interest');

class Friend {
    async getFriendsByUserId(req, res) {
        try {
            let relationships = await db.getFriendsByUserId(req.user.id);

            let friendsInfo = relationships.map(r => {
                if (r.user_id_1 === req.user.id)
                    return {id: r.user_id_2, friendship_date: r.last_update_date};
                else
                    return {id: r.user_id_1, friendship_date: r.last_update_date};
            });

            let friends = [];

            for (let f of friendsInfo) {
                let friend = await userDB.getUserInfo(f.id);
                friend.friendship_date = f.friendship_date;
                friends.push(friend);
            }

            res.status(200).json(friends);
        } catch (err) {
            return res.status(503).json(err)
        }
    }

    async getFriendsByInterest(req, res) {

        let userId = req.user.id;
        let interestId = req.params.interestId;

        try {
            let relationships = await db.getFriendsByUserId(userId);

            let friendsIds = relationships.map(r => {
                if (r.user_id_1 === req.user.id)
                    return r.user_id_2;
                else
                    return r.user_id_1;
            });

            let friends = [];

            for (let id of friendsIds) {
                let friend = await userDB.getUserInfo(id);
                friends.push(friend);
            }

            let interested_friends = [];

            for (let friend of friends) {
                let interestsObjects = await interestDB.getInterestsByUserId(friend.id);
                let interests = interestsObjects.map((i) => i.id.toString());

                if (interests.includes(interestId)) {
                    interested_friends.push({ id: friend.id, name: friend.name, image: friend.image });
                }
            }

            res.status(200).json(interested_friends);
        } catch (err) {
            return res.status(503).json(err)
        }
    }

    async getPossibleFriends(req, res) {
        try {
            let possibleFriendsIds = [];
            let friendsIds = await db.getPossibleFriendsByUserId(req.user.id);
            console.log(friendsIds, "friendsIds");
            let interests = await interestDB.getInterestsByUserId(req.user.id);
            let interestsIds = interests.map((i) => i.id.toString());
            console.log(interestsIds, "interestsIds");
            for (let friend of friendsIds) {
                let friendInterests = await interestDB.getInterestsByUserId(friend.id);
                let friendInterestsIds = friendInterests.map((i) => i.id.toString());
                let commonInterests = interestsIds.filter((i) => friendInterestsIds.includes(i));
                if (commonInterests.length > 0) {
                    possibleFriendsIds.push(friend.id);
                }
            }
            console.log(possibleFriendsIds, "possibleFriendsIds");
            let possibleFriends = [];
            for (let id of possibleFriendsIds) {
                let friend = await userDB.getUserInfo(id);
                possibleFriends.push(friend);
            }
            console.log(possibleFriends, "possibleFriends");
            res.status(200).json(possibleFriends);
        } catch (err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async thumbsUp(req, res) {
        try {
            let userId = req.user.id;
            let friendId = req.params.friend_id;
            let relationship = await db.getRelationship(userId, friendId);
            if (relationship) {
                await db.updateRelationship(userId, friendId, "accepted");
            } else {
                await db.createRelationship(userId, friendId, "pending");
            }
            res.status(200).json("Success");
        } catch (err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async thumbsDown(req, res) {
        try {
            let userId = req.user.id;
            let friendId = req.params.friend_id;
            let relationship = await db.getRelationship(userId, friendId);
            if (relationship) {
                await db.updateRelationship(userId, friendId, "rejected");
            } else {
                await db.createRelationship(userId, friendId, "rejected");
            }
            res.status(200).json("Success");
        } catch (err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }
}

module.exports = Friend;