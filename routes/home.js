const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authMW = require("../middleware/auth.js");
const { v4: uuidv4 } = require('uuid');

router.get("/", authMW, (req, res) => {
	db.query(
		"SELECT p.* FROM pets p WHERE p.user_id = ?",
		[req.user.id],
		(err, results) => {
			if (err) res.status(500).send();
			else{
				const obj = {
					name: req.user.email,
					active: "Home",
					pets: results,
				};
				res.render("index/home", obj);
			}
		}
	);
});

router.post("/add-pet", authMW, (req, res) => {
	let schedules = [];
	if(typeof(req.body.schedules) == 'string') schedules.push(req.body.schedules)
	else schedules = req.body.schedules;
	const uuid = uuidv4();
	db.query(
		"INSERT INTO pets (user_id,name,details,arduino_uuid) VALUES (?,?,?,?) ",
		[req.user.id,req.body.name, req.body.details,uuid],
		(err, results) => {
			if (err) res.status(500).send("Unable to insert pet details.");
			else{
				let id = results.insertId.toString();
				let sql = "";
				let values = [];
				sql += "INSERT INTO schedules (pet_id,time,duration) VALUES ";
 
				for(let z = 0; z<schedules.length; z++){
					sql += "(?,?,?),";
					values.push(id,schedules[z],req.body.duration);
				}
				sql = sql.slice(0,-1);
				db.query(sql,values,(err,results) => {
					if(err) res.status(500).send("Unable to insert schedules.");
					else res.redirect('/home')
				})
			}
		}
	);
});

router.post("/delete", authMW, (req, res) => {
	if (req.body.id) {
		db.query("DELETE FROM pets WHERE id=?", [req.body.id], (err, result) => {
			if (err) res.status(500).send("Error in deleting");
			else res.redirect("/home");
		});
	}else{
		res.send("Unable to delete, no id given");
	}
});

router.post("/edit", authMW, (req, res) => {
	if (req.body.id) {
		db.query(
			"UPDATE PETS SET name=?, details=? WHERE id=?",
			[req.body.name, req.body.details, req.body.id],
			(err, result) => {
				if (err) res.status(500).send("Unable to update");
				else res.redirect('/home');
			}
		);
	}else{
		res.send("Unable to update.")
	}
});

router.get('/:id/logs',authMW,(req,res) => {
	db.query("SELECT status,duration,date_format(date_time, '%m/%d%/%Y %l:%i %p') as date_time FROM feeding_logs WHERE pet_id = ?",[req.params.id],(err,results) => {
		if(err) res.status(404).send("Unable to retrieve logs");
		else res.send(results);
	})
})

router.get('/:id/info',authMW,async (req,res)=>{
	try{
		if(!req.params.id) throw new Error(); 
		const [pet] = await db.promise().query("SELECT * FROM pets WHERE id = ? LIMIT 1",req.params.id);
		const [schedules] = await db.promise().query("SELECT * FROM schedules WHERE pet_id = ?",req.params.id);
		if(!(pet && pet.length !=0)) throw new Error();
		res.send({pet:pet[0],schedules})
	}catch(err){
		return res.status(500).send("Something went wrong...");
	}
})

router.get("/edit/:id", authMW, (req, res) => {
	db.query("SELECT p.id, p.name,p.details FROM pets p WHERE p.id = ? LIMIT 1",req.params.id,(err,results)=>{
		if(err || results.length ==0 ) res.status(404).send("Unable to edit.");
		else res.send(results[0]);

	})
});

router.get("/code/:uuid",authMW,(req,res) => {
	db.query("SELECT * FROM pets WHERE arduino_uuid = ? AND user_id = ? LIMIT 1",[req.params.uuid,req.user.id],(err,results)=>{
		if(err || results.length == 0) res.status(404).send("Cannot find pet");
		else res.render('index/code',{uuid:results[0],port:process.env.PORT,active:''});
	})
})

module.exports = router;
