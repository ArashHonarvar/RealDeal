'use strict';
const fs = require('fs');

function getBase64Image(imagePath) {
    const image = "data:image/jpg;base64," + fs.readFileSync(imagePath, "base64");
    return image;
}

module.exports = {
    mattia_img: getBase64Image("database/images/mattia.jpg"),
    arash_img: getBase64Image("database/images/arash.jpg"),
    michele_img: getBase64Image("database/images/michele.jpg"),
    marta_img: getBase64Image("database/images/marta.jpg"),
    alfredo_img: getBase64Image("database/images/alfredo.jpg"),
    avatar_img: getBase64Image("database/images/avatar.jpg"),
    pizza_img: getBase64Image("database/images/pizza.jpg"),
    beer_img: getBase64Image("database/images/beer.jpg"),
    mario_img: getBase64Image("database/images/mario.jpg"),
    maria_img: getBase64Image("database/images/maria.jpg"),
    cityplex_img: getBase64Image("database/images/cinema.jpg"),
    hamlet_img: getBase64Image("database/images/amleto.jpg"),
}