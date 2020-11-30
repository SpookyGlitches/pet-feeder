const db = require("./config/database");
var CronJob = require('cron').CronJob;
const axios = require('axios');
const connection = require("./config/database");

console.log("Cron job starting ...");
var date;
var job = new CronJob('0 */1 * * * *', function() {
    date = new Date();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes();
    let val = hours + ':' + minutes.toString();
    // let val2 = hours + ':' + (minutes+4).toString();
    db.promise().query("SELECT p.socket_address, p.id,s.duration FROM schedules s INNER JOIN pets p ON s.pet_id = p.id WHERE s.time BETWEEN ? AND ?",[val,val]).then((results,fields) => {
        console.log(`Now feeding schedules ${val}`)
        if(results[0].length>0){
            console.log("Feeding "+results[0].length+ " devices");
            results[0].forEach((item) => {
                console.log(item.socket_address)
                console.log(item)
                axios.get(`http://${item.socket_address}?id=${item.id}`).then(() => console.log("Feed here")).catch(() => {
                    db.query("INSERT INTO feeding_logs (pet_id,status) VALUES (?,?)",[item.id,"FAIL"],(err,results) => {
                        if(err) console.log(err);
                        else console.log('Inserted feeding log failure');
                    })
                });

            })
        }else{
            console.log("No one to feed at the mentioned time.")
        }
    }).catch((e) => console.log(e))


})
function start(){
    job.start();
}

module.exports = {
    start
}