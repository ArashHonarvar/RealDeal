'use strict';

const db = require('./dao');

const pointsMapPerInterestType = [
    {
        interest_id: 1,
        cost: 100,
        gain_sender: 80,
        gain_receiver: 60
    },
    {
        interest_id: 2,
        cost: 40,
        gain_sender: 25,
        gain_receiver: 15
    },
    {
        interest_id: 3,
        cost: 40,
        gain_sender: 25,
        gain_receiver: 15
    },
    {
        interest_id: 4,
        cost: 30,
        gain_sender: 20,
        gain_receiver: 10
    },
    {
        interest_id: 5,
        cost: 30,
        gain_sender: 20,
        gain_receiver: 10
    },
    {
        interest_id: 6,
        cost: 50,
        gain_sender: 40,
        gain_receiver: 25
    },
    {
        interest_id: 7,
        cost: 30,
        gain_sender: 20,
        gain_receiver: 10
    },
    {
        interest_id: 8,
        cost: 50,
        gain_sender: 40,
        gain_receiver: 25
    },
    {
        interest_id: 9,
        cost: 50,
        gain_sender: 40,
        gain_receiver: 25
    },
    {
        interest_id: 10,
        cost: 70,
        gain_sender: 50,
        gain_receiver: 30
    }
];

exports.getVouchersByBusinessId = async (id) => {
    const sql = 'SELECT * FROM VOUCHERS WHERE issuer_id = ?';
    return db.all(sql, [id]);
};

exports.getVouchers = async () => {
    const sql = 'SELECT V.id, V.image, title, name, interest_id, cost, gain_sender, available FROM VOUCHERS V JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id WHERE available > 0';
    return db.all(sql);
};

exports.getVoucherById = async (id) => {
    const sql = 'SELECT V.id, V.title, V.creation_date, V.expiration_date, V.interest_id, V.quantity, V.available, V.image, V.image_path, V.issuer_id, V.cost, V.gain_sender, V.gain_receiver, BI.name, BI.piva, BI.address, BI.city, BI.phone_number, BI.image AS issuer_image FROM VOUCHERS V JOIN BUSINESS_INFO BI ON V.issuer_id = BI.id WHERE V.id = ?';
    return db.get(sql, [id]);
};

exports.addNewVoucher = async (voucher, userId) => {
    let typePoints = pointsMapPerInterestType.filter(p => p.interest_id === voucher.interest_id)[0];
    const sql = 'INSERT INTO VOUCHERS (title, creation_date, expiration_date, interest_id, quantity, available, image, image_path, issuer_id, cost, gain_sender, gain_receiver) \
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return db.insert(sql, [voucher.title, voucher.creation_date, voucher.expiration_date, voucher.interest_id, voucher.quantity, voucher.quantity, voucher.image, voucher.image_path, userId, typePoints.cost, typePoints.gain_sender, typePoints.gain_receiver]);
};

exports.editVoucher = async (voucher, userId) => {
    let typePoints = pointsMapPerInterestType.filter(p => p.interest_id === voucher.interest_id)[0];
    const sql = 'UPDATE VOUCHERS \
                 SET title = ?, creation_date = ?, expiration_date = ?, interest_id = ?, quantity = ?, available = ?, image = ?, image_path = ?, cost = ?, gain_sender = ?, gain_receiver = ? \
                 WHERE id = ? AND issuer_id = ?';
    return db.run(sql, [voucher.title, voucher.creation_date, voucher.expiration_date, voucher.interest_id, voucher.quantity, voucher.quantity, voucher.image, voucher.image_path, typePoints.cost, typePoints.gain_sender, typePoints.gain_receiver, voucher.id, userId]);
};

exports.deleteVoucher = async (voucherId, userId) => {
    const sql = 'DELETE FROM VOUCHERS WHERE id = ? AND issuer_id = ?';
    return db.run(sql, [voucherId, userId]);
};
