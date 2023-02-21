'use strict';

const db = require('./dao');

exports.getAllUserInterests = async (userID) => {
    const sql = 'SELECT * FROM USER_INTERESTS WHERE user_id = ?';
    return db.all(sql, [userID]);
};

exports.removeAllUserInterests = async (userID) => {
    const sql = 'DELETE FROM USER_INTERESTS WHERE user_id = ?';
    return db.all(sql, [userID]);
};

exports.addUserInterest = async (userInterest) => {
    const sql = 'INSERT INTO USER_INTERESTS(user_id,interest_id) VALUES(?,?) ';
    return db.run(sql, [userInterest.user_id, userInterest.interest_id]);
};