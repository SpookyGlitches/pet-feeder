const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authMW = require("../middleware/auth.js");

router.get("/", authMW, (req, res) => {
	db.query(
		"SELECT id,name,details,color FROM pets WHERE user_id=?",
		[req.user.id],
		(err, results) => {
			if (err) throw err;
			const obj = {
				name: req.user.email,
				active: "Home",
				pets: results,
			};
			res.render("index/home", obj);
		}
	);
});

router.post("/add-pet", authMW, (req, res) => {
	console.log(req.body.schedules);
	db.query(
		"INSERT INTO pets (user_id,socket_address,name,details) VALUES (?,?,?,?) ",
		[req.user.id, req.body.socket,req.body.name, req.body.details],
		(err, results) => {
			if (err){
				console.log(err);
				res.status(500).send("kugtong");
			} 
			else{
				let id = results.insertId.toString();
				let sql = "";
				let values = [];
				sql += "INSERT INTO schedules (pet_id,time) VALUES ";
				req.body.schedules.forEach(element => {
					sql+= " (?,?),";
					values.push(id,element);
				});
				sql = sql.slice(0,-1);
				console.log(sql);
				console.log(values);
				db.query(sql,values,(err,results) => {
					if(err){
						console.log(err);
						res.status(500).send("imong mama");
					} 
					else res.redirect('/home')
				})
			}
		}
	);
});

router.post("/delete", authMW, (req, res) => {
	if (req.body.id) {
		db.query("DELETE FROM pets WHERE id=?", [req.body.id], (err, result) => {
			if (err) throw err;
			req.session.message = {
				status: "Success",
				message: "Successfully deleted!",
			};
		});
	}
	res.redirect("/home");
});

router.post("/edit", authMW, (req, res) => {
	if (req.body.id) {
		db.query(
			"UPDATE PETS SET name=?, details=? WHERE id=?",
			[req.body.name, req.body.details, req.body.id],
			(err, result) => {
				if (err) throw err;
				// req.session.message = {
				// 	status: "Success",
				// 	message: "Successfully updated!"
				// }
			}
		);
	}
	res.redirect("/home");
});

router.get('/:id/logs',authMW,(req,res) => {
	db.query("SELECT status,duration,date_format(date_time, '%W %l:%i %p') as date_time FROM feeding_logs WHERE pet_id = ?",[req.params.id],(err,results) => {
		if(err) throw err;
		else res.send(results);
	})
})

router.get("/edit/:id", authMW, (req, res) => {
	db.query("SELECT p.id as pet_id,p.details,p.name,s.time,s.id as schedule_id FROM pets p INNER JOIN schedules s ON p.id = s.pet_id WHERE p.id = ?",req.params.id,(err,results)=>{
		if(err) throw err;
		else res.send(results);
	})
});

module.exports = router;
