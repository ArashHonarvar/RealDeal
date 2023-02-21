"use strict"

const sqlite = require('sqlite3');
const db = new sqlite.Database('./database/RealDeal.sqlite', (err) => {
    if (err) throw err;
});

db.run("PRAGMA foreign_keys = ON");

exports.all = (stmt, params) => {
    return new Promise((res, rej) => {
        db.all(stmt, params, (error, result) => {
            if (error) {
                return rej(error.message);
            }
            return res(result);
        });
    })
};

exports.serialize = (f) => {
    db.serialize(f);
};

exports.get = (stmt, params) => {
    return new Promise((res, rej) => {
        db.get(stmt, params, (error, result) => {
            if (error) {
                return rej(error.message);
            }
            return res(result);
        });
    })
};

exports.run = (stmt, params) => {
    return new Promise((res, rej) => {
        db.run(stmt, params, (error) => {
            if (error) {
                return rej(error.message);
            }
            return res(true);
        });
    })
};

exports.insert = (stmt, params) => {
    return new Promise((res, rej) => {
        db.run(stmt, params, function (err) {
            if (err) {
              rej(err);
              return;
            }
            if (this.changes === 0) rej("operation failed");
            res(this.lastID);
          }
        );
    })
};