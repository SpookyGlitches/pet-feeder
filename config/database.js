var mysql  = require('mysql2');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'smart_pet_feeder'
})
connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

module.exports = connection;
