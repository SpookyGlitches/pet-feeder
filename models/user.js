const  db = require('../config/database')
let user = {};
const { genPassword } = require('../helpers/password');

user.createUser = function (email,password, callback) {
    let passworda = genPassword(password);
    db.query("INSERT INTO users (email, hash, salt) VALUES (?,?,?)",[email,passworda.hash,passworda.salt], function (err, result) {
        callback(err, result);
    });
};

module.exports = user;