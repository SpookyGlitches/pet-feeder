const  db = require('../config/database')
let user = {};
const crypto = require('crypto');


user.createUser = function (email,password, callback) {
    let passworda = genPassword(password);
    db.query("INSERT INTO users (email, hash, salt) VALUES (?,?,?)",[email,passworda.hash,passworda.salt], function (err, result) {
        // We will pass the error and the result to the function
        callback(err, result);
    });
};

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

module.exports = user;