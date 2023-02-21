"use strict"

const db = require('../Queries/invitation');
const voucherDB = require('../Queries/voucher');

class Invitation {
    async sendInvitation(req, res) {
        let userId = req.user.id;
        
        try {
            await db.sendInvitation(userId, req.body);
            res.status(201).end()
        } catch (err) {
            let message = "Server error"
            console.log(err);
            return res.status(503).json(err);
        }
    }

    async getReceivedInvitations(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getReceivedInvitations(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getSentInvitations(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getSentInvitations(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getUserAcceptedInvitationsSent(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getUserAcceptedInvitationsSent(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getUserAcceptedInvitationsReceived(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getUserAcceptedInvitationsReceived(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getUserLastInvitationsSent(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getUserLastInvitationsSent(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getUserLastInvitationsReceived(req, res) {

        let userId = req.user.id;

        try {
            let invitations = await db.getUserLastInvitationsReceived(userId);
            res.status(200).json(invitations);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getSentInvitation(req, res) {

        let userId = req.user.id;
        let receiverId = req.params.receiver_id;
        let voucherId = req.params.voucher_id

        try {
            let invitation = await db.getInvitation(userId, receiverId, voucherId);
            res.status(200).json(invitation);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async getReceivedInvitation(req, res) {

        let userId = req.user.id;
        let sender_id = req.params.sender_id;
        let voucherId = req.params.voucher_id

        try {
            let invitation = await db.getInvitation(sender_id, userId, voucherId);
            if(!invitation) {
                return res.status(404).json(null);
            }
            res.status(200).json(invitation);
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async acceptInvitation(req, res) {

        try {
            await db.changeInvitationStatus(req.body, "accepted");
            res.status(200).end();
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async declineInvitation(req, res) {

        try {
            await db.changeInvitationStatus(req.body, "rejected");
            res.status(200).end();
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async doneInvitation(req, res) {

        try {
            let invitation = await db.getInvitation(req.body.sender_id, req.body.receiver_id, req.body.voucher_id);

            if(invitation.status === "accepted") {
                let voucher = await voucherDB.getVoucherById(invitation.voucher_id);
                if(voucher) {
                    invitation.gain_sender = voucher.gain_sender;
                    invitation.gain_receiver = voucher.gain_receiver
                }
                let count = await db.changeInvitationStatus(invitation, "done");
                res.status(200).end();
            } else {
                let message = "No such valid invitation"
                return res.status(503).json(message)
            }
            
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }

    async deleteInvitation(req, res) {
        try {
            await db.deleteInvitation(req.body);
            res.status(200).end();
        } catch(err) {
            let message = "Server error"
            console.log(err)
            return res.status(503).json(message)
        }
    }
}

module.exports = Invitation;