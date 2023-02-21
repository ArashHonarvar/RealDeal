'use strict';

const { mattia_img, alfredo_img, avatar_img, pizza_img, beer_img, michele_img, arash_img, marta_img, mario_img, cityplex_img, maria_img, hamlet_img } = require('./images/getImages');

const dbName = "./database/RealDeal.sqlite";

const sqlite = require('sqlite3');

const db = new sqlite.Database(dbName, (err) => {
    if (err) throw err;
});

db.serialize(function () {
    db.run("PRAGMA foreign_keys = ON");

    db.run(
        'CREATE TABLE IF NOT EXISTS "USER" (\
            "id" INTEGER NOT NULL,\
            "email" TEXT NOT NULL UNIQUE,\
            "password" TEXT NOT NULL,\
            "salt" TEXT NOT NULL,\
            "type" TEXT NOT NULL,\
            PRIMARY KEY("id" AUTOINCREMENT)\
        );'
    );

    db.run(
        'INSERT OR IGNORE INTO USER(email, password, salt, type)\
         VALUES ("mattia@realdeal.com", "b5dcf4fb9a4e09249895a10381743b75ab7c270cc45dc606abef91b8ad33a167f00d42bce3df118e3a7dd6c38730b205bf61ac57ee6ab463f1deb48f0adbc6ae", "890f74d279b93dbfa8b7ceb7b32a814c", "User"),\
                ("michele@realdeal.com", "d603f6fbd042c8b3b38d2f0b1b8f61da1eafab7ba2b88f23fd09a78fda4b37ba4fe516ac681d9db352c18530a9f8420910fa96b2aacc3481ffcb7404f11559cc", "dceccb0fd611f93e5eb511892e657373", "User"),\
                ("arash@realdeal.com", "1d3326af69d1878998af1c26618c3bb2039a210322ed1997e99e8343273f2bcf6e0556db049c344e2e4bd762da15bb1c6ea89a20e3a64b6d9f75356b0be55f93", "c841881b15c00ab22970a9d7e23e33d7", "User"),\
                ("marta@realdeal.com", "8b326c52ce3c1a3ce6496d6c018dcfbd9bb243c889e8e5a95471b4dd6245dcf9e209dfa6398365a61c058f87615baa3e74492dcf54cff38057d6cb35655af1cb", "b0819e4c8b88055bdeb725b8534911f8", "User"),\
                ("alfredos@gmail.com", "842ed52f7034cbafbd403b382e402b3f76f2578094d29b74aabe8e7a07e4b20274454986955b65ffde40574f860a1fdfb7128b8b3081defd6d7d056c59a13093", "af1cbfc6c4b281ac9f4b0d8342c6284d", "Business"),\
                ("mariorossi@gmail.com", "a09e1ad27d1790d0b20631ed21e4b8fbd52224968b4d1691191973260b3f8b05b739fbfccd74ddee9dd0fc966981260001d42f0885f4fec1bc6668440849bb2d", "e5b37aee970e66140c8a2fb09801ac5c", "User"),\
                ("cityplex@gmail.com", "37f0ae270611c7f68009724a1060cda6db825762a9eb2530bdad9206ad90d8a384673778ad03d997618d21047286ad6ec6745e6efee57d4e50c62cf902156326", "dc073162012095c23c7f7b48941ea1f7", "Business"),\
                ("mariabianchi@gmail.com", "de904a5d798ce13beeac983bf2da5621ec2ab2daa3729469c229eced214864678d1db3bb4cb0ad06ae82863e4b014be3eb344f1112fcf275712eeb080f877360", "d79c7c25715f1eedc9c59c349e173500", "User")\
        '
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS "USER_INFO" (\
            "name" TEXT NOT NULL,\
            "age" INTEGER NOT NULL,\
            "city" TEXT NOT NULL,\
            "points" INTEGER NOT NULL,\
            "image" TEXT,\
            "id" INTEGER NOT NULL,\
            PRIMARY KEY("id"),\
            FOREIGN KEY("id") REFERENCES "USER"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO USER_INFO(name, age, city, points, image, id)\
         VALUES ("Mattia Scamuzzi", 23, "Casale Monferrato", 10000, ?, 1),\
                ("Michele Del Guercio", 23, "Verbania", 10000, ?, 2),\
                ("Arash Honarvar", 23, "Vercelli", 10000, ?, 3),\
                ("Marta Corcione", 23, "Novara", 10000, ?, 4),\
                ("Mario Rossi", 18, "Torino", 400, ?, 6),\
                ("Maria Bianchi", 21, "Torino", 200, ?, 8)\
        ', [mattia_img, michele_img, arash_img, marta_img, mario_img, maria_img]
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS "BUSINESS_INFO" (\
            "name" TEXT NOT NULL,\
            "piva" TEXT NOT NULL,\
            "address" TEXT NOT NULL,\
            "city" TEXT NOT NULL,\
            "phone_number" TEXT NOT NULL,\
            "image" TEXT,\
            "id" INTEGER NOT NULL,\
            PRIMARY KEY("id"),\
            FOREIGN KEY("id") REFERENCES "USER"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO BUSINESS_INFO(name, piva, address, city, phone_number, image, id)\
         VALUES ("Alfredo\'s Pizzeria", "12764714443", "Via Roma, 56", "Torino", "3459876123", ?, 5),\
                ("Ideal Cityplex", "32762714743", "Corso Giambattista Beccaria, 4", "Torino", "3264785432", ?, 7)\
        ', [alfredo_img, cityplex_img]
    );

    // REMEMBER TO CALL THE ICONS EXACTLY AS THE CORRESPONDENT INTEREST

    // MAYBE INSERT A COST FIELD IN HERE FOR EACH INTEREST
    db.run(
        'CREATE TABLE IF NOT EXISTS "INTERESTS" (\
            "id" INTEGER NOT NULL,\
            "name" TEXT NOT NULL,\
            PRIMARY KEY("id" AUTOINCREMENT)\
        );'
    );

    db.run(
        'INSERT INTO INTERESTS(name)\
         VALUES ("Travel"),\
                ("Art"),\
                ("Sports"),\
                ("Food"),\
                ("Books"),\
                ("Music"),\
                ("Movies"),\
                ("Theatre"),\
                ("Videogames"),\
                ("Nature")\
        ;'
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS "USER_INTERESTS" (\
            "user_id" INTEGER NOT NULL,\
            "interest_id" INTEGER NOT NULL,\
            PRIMARY KEY("user_id", "interest_id"),\
            FOREIGN KEY("user_id") REFERENCES "USER"("id") on DELETE CASCADE,\
            FOREIGN KEY("interest_id") REFERENCES "INTERESTS"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO USER_INTERESTS(user_id, interest_id)\
         VALUES (1, 4),\
                (1, 7),\
                (2, 4),\
                (2, 7),\
                (3, 4),\
                (3, 7),\
                (3, 10),\
                (4, 4),\
                (4, 5),\
                (4, 7),\
                (6, 4),\
                (6, 5),\
                (6, 7),\
                (8, 4),\
                (8, 5),\
                (8, 7)\
        ;'
    );

    //WRITE POINTS GUIDE FOR USER IN ABOUT PAGE
    db.run(
        'CREATE TABLE IF NOT EXISTS "VOUCHERS" (\
            "id" INTEGER NOT NULL,\
            "title" TEXT NOT NULL,\
            "creation_date" DATETIME NOT NULL,\
            "expiration_date" DATETIME NOT NULL,\
            "interest_id" INTEGER NOT NULL,\
            "quantity" INTEGER NOT NULL,\
            "available" INTEGER NOT NULL,\
            "image" TEXT,\
            "image_path" TEXT,\
            "issuer_id" INTEGER NOT NULL,\
            "cost" INTEGER NOT NULL,\
            "gain_sender" INTEGER NOT NULL,\
            "gain_receiver" INTEGER NOT NULL,\
            PRIMARY KEY("id" AUTOINCREMENT),\
            FOREIGN KEY("interest_id") REFERENCES "INTERESTS"("id") on DELETE CASCADE,\
            FOREIGN KEY("issuer_id") REFERENCES "USER"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO VOUCHERS(title, creation_date, expiration_date, interest_id, quantity, available, image, image_path, issuer_id, cost, gain_sender, gain_receiver)\
         VALUES ("30% discount on two pizzas", "2022-12-11", "2023-12-23", 4, 30, 30, ?, "pizza.jpg", 5, 30, 20, 10),\
                ("Avatar 2", "2023-01-15", "2023-03-30", 7, 20, 20, ?, "avatar.jpg", 7, 30, 20, 10),\
                ("Buy 2 beers, get 1 free", "2022-12-22", "2023-12-22", 4, 40, 40, ?, "beer.jpg", 5, 30, 20, 10),\
                ("Hamlet", "2023-01-14", "2023-03-30", 8, 20, 20, ?, "hamlet.jpg", 7, 50, 40, 25)\
        ;', [pizza_img, avatar_img, beer_img, hamlet_img]
    );

    // STATUS CAN BE (pending, accepted, rejected)

    db.run(
        'CREATE TABLE IF NOT EXISTS "USER_RELATIONSHIPS" (\
            "user_id_1" INTEGER NOT NULL,\
            "user_id_2" INTEGER NOT NULL,\
            "status" TEXT NOT NULL,\
            "last_update_date" DATETIME NOT NULL,\
            PRIMARY KEY("user_id_1", "user_id_2"),\
            FOREIGN KEY("user_id_1") REFERENCES "USER"("id") on DELETE CASCADE,\
            FOREIGN KEY("user_id_2") REFERENCES "USER"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO USER_RELATIONSHIPS(user_id_1, user_id_2, status, last_update_date)\
         VALUES (1, 2, "pending", "2023-01-09"),\
                (1, 3, "rejected", "2023-01-11"),\
                (2, 3, "pending", "2023-01-10"),\
                (2, 4, "rejected", "2023-01-08"),\
                (3, 4, "accepted", "2023-01-12"),\
                (1, 6, "accepted", "2023-01-16"),\
                (2, 6, "accepted", "2023-01-15"),\
                (3, 6, "pending", "2023-01-14"),\
                (4, 6, "pending", "2023-01-14"),\
                (1, 8, "accepted", "2023-01-16"),\
                (2, 8, "accepted", "2023-01-15"),\
                (3, 8, "pending", "2023-01-14"),\
                (4, 8, "pending", "2023-01-14")\
        ;'
    );

    // STATUS CAN BE (pending, accepted, rejected)
    // CREATE QRCODE WITH STRING. THE STRING IS THE CONCATENATION
    // OF SENDER_ID, RECEIVER_ID AND VOUCHER_ID

    db.run(
        'CREATE TABLE IF NOT EXISTS "INVITATIONS" (\
            "sender_id" INTEGER NOT NULL,\
            "receiver_id" INTEGER NOT NULL,\
            "voucher_id" INTEGER NOT NULL,\
            "status" TEXT NOT NULL,\
            "last_update_date" DATETIME NOT NULL,\
            PRIMARY KEY("sender_id", "receiver_id", "voucher_id"),\
            FOREIGN KEY("sender_id") REFERENCES "USER"("id") on DELETE CASCADE,\
            FOREIGN KEY("receiver_id") REFERENCES "USER"("id") on DELETE CASCADE,\
            FOREIGN KEY("voucher_id") REFERENCES "VOUCHERS"("id") on DELETE CASCADE\
        );'
    );

    db.run(
        'INSERT INTO INVITATIONS(sender_id, receiver_id, voucher_id, status, last_update_date)\
         VALUES (1, 2, 1, "pending" , "2023-01-09 10:10"),\
                (2, 4, 2, "rejected", "2023-01-10 11:11"),\
                (1, 4, 3, "accepted" , "2023-01-11 09:09"),\
                (1, 6, 2, "accepted" , "2023-01-18 09:09"),\
                (6, 2, 4, "pending" , "2023-01-18 09:09"),\
                (1, 8, 2, "pending" , "2023-01-18 09:09"),\
                (2, 8, 4, "pending" , "2023-01-18 09:09")\
        '
    );
});