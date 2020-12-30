const db = require("./config/database");
var CronJob = require('cron').CronJob;
const WebSocket = require('ws');
console.log("Cron job starting ...");
let date1, date2,val1,val2;
let ws;
let job = new CronJob('0 */2 * * * *', function() {
    date1 = new Date();
    date2 = new Date(date1.getTime() + (1 * 60 * 1000));
    val1 = date1.toLocaleTimeString(["en-GB"],{hour:'2-digit',minute:'2-digit'})
    val2 = date2.toLocaleTimeString(["en-GB"],{hour:'2-digit',minute:'2-digit'})
    db.promise().query("SELECT p.id as id,p.arduino_uuid as uuid,s.time,s.duration FROM schedules s INNER JOIN pets p ON s.pet_id = p.id WHERE s.time BETWEEN ? AND ?",[val1,val2]).then(([results,fields]) => {
        console.log(`Now feeding schedules between ${val1} - ${val2}`)
        if(results.length>0){
            console.log("Feeding "+results.length+ " devices");
            results.forEach((item) => {
                ws = new WebSocket(`wss://it-treats.azurewebsites.net`,"json");
                ws.onopen = function(){
                    let details = {
                        type:'req',
                        id:item.id,
                        uuid:item.uuid,
                        duration:item.duration,
                        meta:"join"
                    }
                    ws.send(JSON.stringify(details));
                    details.meta = "";
                    ws.send(JSON.stringify(details))
                    details.meta = "leave";
                    ws.send(JSON.stringify(details))
                    ws.close();
                  }
            })
        }else{
            console.log("No one to feed at the mentioned time.")
        }
    }).catch((e) => console.log(e))


})

module.exports = job;

