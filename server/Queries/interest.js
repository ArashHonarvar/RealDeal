'use strict';

const db = require('./dao');

exports.getAllInterests = async () => {
    const sql = 'SELECT * FROM INTERESTS';
    return db.all(sql, []);
};

exports.getInterestsByUserId = async (userId) => {
    const sql = 'SELECT I.id, I.name FROM INTERESTS AS I, USER_INTERESTS AS UI WHERE I.id = UI.interest_id AND UI.user_id = ?';
    return db.all(sql, [userId]);
};