'use strict';

const db = require('./dao');


exports.getUserById = async (id) => {
    const sql = 'SELECT id, type FROM USER WHERE id = ?';
    return db.get(sql, [id]);
};


exports.getUser = async (email) => {
    const sql = 'SELECT * FROM USER WHERE email = ?';
    return db.get(sql, [email]);
};

exports.getUserType = async (id) => {
    const sql = 'SELECT type FROM USER WHERE id = ?';
    return db.get(sql, [id]);
};

exports.newUser = async(email, password, salt, type) => {
    const sql = 'INSERT INTO USER(email, password, salt, type)\
                        VALUES (?, ?, ?, ?)';
    return db.insert(sql, [email, password, salt, type]);
};

exports.addUserInfo = async(info, id) => {
    const sql = 'INSERT INTO USER_INFO(name, age, city, points, image, id)\
                        VALUES (?, ?, ?, ?, ?, ?)';
    return db.insert(sql, [info.name, info.age, info.city, 400, info.image, id]);
};

exports.getUserInfo = async(id) => {
    const sql = 'SELECT email, name, age, city, points, image, U.id FROM USER AS U, USER_INFO AS UI WHERE (U.id = UI.id) AND U.id = ?';
    return db.get(sql, [id]);
};

exports.getBusinessInfo = async(id) => {
    const sql = 'SELECT * FROM BUSINESS_INFO WHERE id = ?';
    return db.get(sql, [id]);
};

exports.addBusinessInfo = async(info, id) => {
    const sql = 'INSERT INTO BUSINESS_INFO(name, piva, address, city, phone_number, image, id)\
                        VALUES (?, ?, ?, ?, ?, ?, ?)';
    return db.insert(sql, [info.name, info.piva, info.address, info.city, info.phone_number, info.image, id]);
};

exports.getCreatorImage = async(id) => {
    const sql = 'SELECT image FROM USER_INFO WHERE id = ?';
    return db.get(sql, [id]);
}