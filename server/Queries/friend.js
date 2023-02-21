'use strict';

const db = require('./dao');
const dayjs = require('dayjs');

exports.getFriendsByUserId = async (userId) => {
    const sql = 'SELECT * FROM USER_RELATIONSHIPS WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = "accepted" ORDER BY last_update_date DESC';
    return db.all(sql, [userId, userId]);
};

exports.getPossibleFriendsByUserId = async (userId) => {
    const sql = 'SELECT id FROM USER WHERE id <> ? AND type="User" AND id NOT IN (SELECT user_id_1 FROM USER_RELATIONSHIPS WHERE user_id_2 = ? AND (status = "accepted" OR status ="rejected")) AND id NOT IN (SELECT user_id_2 FROM USER_RELATIONSHIPS WHERE user_id_1 = ?)';
    return db.all(sql, [userId, userId, userId]);
}

exports.getRelationship = async (userId1, userId2) => {
    const sql = 'SELECT * FROM USER_RELATIONSHIPS WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)';
    return db.get(sql, [userId1, userId2, userId2, userId1]);
}

exports.createRelationship = async (userId1, userId2, status) => {
    const sql = 'INSERT INTO USER_RELATIONSHIPS (user_id_1, user_id_2, status, last_update_date) VALUES (?, ?, ?, ?)';
    return db.run(sql, [userId1, userId2, status, dayjs().format('YYYY-MM-DD')]);
}

exports.updateRelationship = async (userId1, userId2, status) => {
    const sql = 'UPDATE USER_RELATIONSHIPS SET status = ?, last_update_date = ? WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)';
    return db.run(sql, [status, dayjs().format('YYYY-MM-DD'), userId1, userId2, userId2, userId1]);
}