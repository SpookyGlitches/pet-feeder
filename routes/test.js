const express = require('express');
const router = express.Router()

const {Board, Servo} = require("johnny-five");
const board = new Board({
    port:"COM14",
});

let servo;
board.on("ready",()=>{
    servo = new Servo.Continuous(10);
})
router.get('/cw',(req,res)=>{
    servo.cw();
    res.send("woops clock-wise");

})
router.get('/ccw',(req,res)=>{
    servo.ccw();
    res.send("woops counterclock-wise");
})
module.exports = router