"use strict"

const db = require('../Queries/voucher');
const interestsDB = require('../Queries/interest');
const invitationDB = require('../Queries/invitation');

class Voucher {
    async getVouchersByBusinessId(req, res) {
        let userId = req.user.id;

        try {
            let vouchers = await db.getVouchersByBusinessId(userId);
            res.status(200).json(vouchers);
        } catch {
            let message = "Server error"
            return res.status(503).json(message)
        }
    }

    async getVouchers(req,res) {
        try {
            let vouchers = await db.getVouchers();
            let interests = await interestsDB.getInterestsByUserId(req.user.id);
            let sentInvitations = await invitationDB.getSentInvitations(req.user.id);
            let receivedInvitations = await invitationDB.getReceivedInvitations(req.user.id);
            let filteredVouchers = vouchers.filter(v => (interests.map(i => i.id).includes(v.interest_id)) && (!sentInvitations.map(i => i.voucher_id).includes(v.id)) && (!receivedInvitations.map(i => i.voucher_id).includes(v.id)));
            
            res.status(200).json(filteredVouchers);
        } catch {
            let message = "Server error"
            return res.status(503).json(message)
        }
    }

    async getVoucherById(req,res) {

        let voucherId = req.params.id;

        try {
            let voucher = await db.getVoucherById(voucherId);
            res.status(200).json(voucher);
        } catch {
            let message = "Server error"
            return res.status(503).json(message)
        }
    }

    async addNewVoucher(req, res) {
        let userId = req.user.id;
        
        try {
            await db.addNewVoucher(req.body, userId);
            res.status(201).end()
        } catch (err) {
            let message = "Server error"
            return res.status(503).json(err);
        }
    }

    async editVoucher(req, res) {
        let userId = req.user.id;

        try {
            await db.editVoucher(req.body, userId);
            res.status(201).end()
        } catch (err) {
            console.log(err);
            let message = "Server error"
            return res.status(503).json(err);
        }
    }

    async deleteVoucher(req, res) {
        let voucher_id = req.params.voucher_id;
        let userId = req.user.id;

        try {
            await db.deleteVoucher(voucher_id, userId);
            res.status(201).end()
        } catch (err) {
            console.log(err);
            let message = "Server error"
            return res.status(503).json(err);
        }
    }

    async getCommonVouchers(req, res) {

        let friend_id = req.params.friend_id;

        try {
            let vouchers = await db.getVouchers();
            let myInterests = await interestsDB.getInterestsByUserId(req.user.id);
            let friendInterests = await interestsDB.getInterestsByUserId(friend_id);
            let interests = myInterests.filter(interest => friendInterests.map(i => i.id).includes(interest.id));
            let sentInvitations = await invitationDB.getSentInvitations(req.user.id);
            let receivedInvitations = await invitationDB.getReceivedInvitations(req.user.id);
            let filteredVouchers = vouchers.filter(v => (interests.map(i => i.id).includes(v.interest_id)) && (!sentInvitations.map(i => i.voucher_id).includes(v.id)) && (!receivedInvitations.map(i => i.voucher_id).includes(v.id)));

            res.status(200).json(filteredVouchers);
        } catch {
            let message = "Server error"
            return res.status(503).json(message)
        }
    }
}

module.exports = Voucher;