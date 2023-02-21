'use strict';

const db = require('./dao');
const dayjs = require('dayjs')

exports.sendInvitation = async (senderId, invitation) => {
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    return db.serialize(function () {
        db.run("BEGIN;");
        db.insert("INSERT INTO INVITATIONS (sender_id, receiver_id, voucher_id, status, last_update_date) \
                      VALUES(?, ?, ?, ?, ?);", [senderId, invitation.receiver_id, invitation.voucher_id, "pending", currentDateTime]);
        db.run("UPDATE USER_INFO SET points = points - ? WHERE id = ? ;", [invitation.cost, senderId]);
        db.run("UPDATE VOUCHERS SET available = available - 1 WHERE id = ? ;", [invitation.voucher_id]);
        db.run("COMMIT;");
    });
}

exports.getReceivedInvitations = async (userId) => {
    const sql = 'SELECT I.sender_id, I.receiver_id, I.voucher_id, V.title, V.creation_date, V.expiration_date, V.interest_id, V.quantity, V.available, V.image, V.issuer_id, V.cost, V.gain_sender, V.gain_receiver, BI.name, BI.piva, BI.address, BI.city, BI.phone_number, BI.image AS issuer_image FROM INVITATIONS AS I, VOUCHERS AS V, BUSINESS_INFO AS BI WHERE BI.id = V.issuer_id AND I.voucher_id = V.id AND I.receiver_id = ? AND (status = "pending" OR status = "accepted")';
    return db.all(sql, [userId]);
};

exports.getSentInvitations = async (userId) => {
    const sql = 'SELECT I.sender_id, I.receiver_id, I.voucher_id, V.title, V.creation_date, V.expiration_date, V.interest_id, V.quantity, V.available, V.image, V.issuer_id, V.cost, V.gain_sender, V.gain_receiver, BI.name, BI.piva, BI.address, BI.city, BI.phone_number, BI.image AS issuer_image FROM INVITATIONS AS I, VOUCHERS AS V, BUSINESS_INFO AS BI WHERE BI.id = V.issuer_id AND I.voucher_id = V.id AND I.sender_id = ? AND (status = "pending" OR status = "accepted")';
    return db.all(sql, [userId]);
};

exports.getInvitation = async (userId, receiverId, voucherId) => {
    const sql = 'SELECT * FROM INVITATIONS WHERE sender_id = ? AND receiver_id = ? AND voucher_id = ?';
    return db.get(sql, [userId, receiverId, voucherId]);
};

exports.getUserAcceptedInvitationsSent = async (userId) => {
    const sql = 'SELECT V.id , I.sender_id, I.receiver_id, V.title, V.image, BI.name AS businessName, UI.name AS receiverName, UI.image AS receiverImage FROM INVITATIONS AS I JOIN VOUCHERS AS V ON I.voucher_id = V.id JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id JOIN USER_INFO UI ON I.receiver_id = UI.id WHERE I.sender_id = ? AND I.status = "accepted" ';
    return db.all(sql, [userId]);
};

exports.getUserAcceptedInvitationsReceived = async (userId) => {
    const sql = 'SELECT V.id , I.sender_id, I.receiver_id, V.title, V.image, BI.name AS businessName, UI.name AS senderName, UI.image AS senderImage FROM INVITATIONS AS I JOIN VOUCHERS AS V ON I.voucher_id = V.id JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id JOIN USER_INFO UI ON I.sender_id = UI.id WHERE I.receiver_id = ? AND I.status = "accepted" ';
    return db.all(sql, [userId]);
};


exports.getUserLastInvitationsSent = async (userId) => {
    const sql = 'SELECT V.id, I.status, I.sender_id, I.receiver_id, I.last_update_date, V.gain_sender , V.gain_receiver, V.cost, V.title, V.image, BI.name AS businessName, UI.name AS receiverName, UI.image AS receiverImage FROM INVITATIONS AS I JOIN VOUCHERS AS V ON I.voucher_id = V.id JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id JOIN USER_INFO UI ON I.receiver_id = UI.id WHERE I.sender_id = ?  ORDER BY V.id LIMIT 5';
    return db.all(sql, [userId]);
};

exports.getUserLastInvitationsReceived = async (userId) => {
    const sql = 'SELECT V.id, I.status, I.sender_id, I.receiver_id, I.last_update_date, V.gain_sender , V.gain_receiver, V.cost, V.title, V.image, BI.name AS businessName, UI.name AS senderName, UI.image AS senderImage FROM INVITATIONS AS I JOIN VOUCHERS AS V ON I.voucher_id = V.id JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id JOIN USER_INFO UI ON I.sender_id = UI.id WHERE I.receiver_id = ? AND I.status = "done" ORDER BY V.id LIMIT 5';
    return db.all(sql, [userId]);
};

exports.changeInvitationStatus = async (invitation, status) => {
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (status !== "done") {
        return db.run('UPDATE INVITATIONS SET status = ?, last_update_date = ? WHERE sender_id = ? AND receiver_id = ? AND voucher_id = ?', [status, currentDateTime, invitation.sender_id, invitation.receiver_id, invitation.voucher_id]);
    } else {
        return db.serialize(function () {
            db.run("BEGIN;");
            db.run('UPDATE INVITATIONS SET status = ?, last_update_date = ? WHERE sender_id = ? AND receiver_id = ? AND voucher_id = ?', [status, currentDateTime, invitation.sender_id, invitation.receiver_id, invitation.voucher_id]);
            db.run("UPDATE USER_INFO SET points = points + ? WHERE id = ? ;", [invitation.gain_sender, invitation.sender_id]);
            db.run("UPDATE USER_INFO SET points = points + ? WHERE id = ? ;", [invitation.gain_receiver, invitation.receiver_id]);
            db.run("COMMIT;");
        });
    }
}

exports.deleteInvitation = async (invitation) => {
    const sql = 'DELETE FROM INVITATIONS WHERE sender_id = ? AND receiver_id = ? AND voucher_id = ?';
    return db.run(sql, [invitation.sender_id, invitation.receiver_id, invitation.voucher_id])
}