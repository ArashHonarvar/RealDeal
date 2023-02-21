'use strict';

const fs = require('fs');

const DBPath = "./database/RealDeal.sqlite";

if(fs.existsSync(DBPath))
    fs.unlinkSync(DBPath);