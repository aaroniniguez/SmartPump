const express = require('express'); 
const keys = require(__dirname+"/keys.js")
var dotenv = require('dotenv').config({path: __dirname + '/../.env'});
var cors = require('cors');
const {logger, isEmptyObject} =  require("./utils.js")
console.log = logger;
var bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const adapter = new FileSync(__dirname+'/users.json')
const db = low(adapter);
const jwt = require("jsonwebtoken");
var passport = require('passport');
var cookieParser = require('cookie-parser')
require(__dirname+"/passport.js")(passport);

const cookieOptions = {
	maxAge: 31556926,
	secure :false,
	httpOnly: true
}
//catches all errors, use this wrapper on all app.get callback func
const asyncHandler = fn =>  
    (req, res, next) =>  {
        Promise.resolve(fn(req, res, next)).catch(function(error){   
			console.log(error);
			if(error.name == "InvalidInput" || error.name == "InvalidCredentials"){
				res.send(`{"type":"error","message":"${error.message}"}`);
				res.end();
				return;
			}else{
				console.log(error);
			}
            next();
        });
    };  
	
let app = express();
app.use(cookieParser())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", `http://${process.env.HOST}:${process.env.CLIENT_PORT}`)
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();
})
app.use(passport.initialize());
app.response.savedSend = app.response.send;
app.response.send = function(data) {
	console.log("RESPONSE "+ data);	
	return this.savedSend(data);
};

app.use(bodyParser.urlencoded({
	 extended: true 
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	res.type("json");
	if(isEmptyObject(req.body))
		console.log(req.method +" "+ req.url);
	else
		console.log(req.method +" "+ req.url, req.body);
	next();
});

function userExists(email) {
	let hasEmail = db.get("users")
		.find({email: email})
		.value();
	return hasEmail
}

function createUserObject(userId, data) {
	let userObject = {
		id: userId,
		email: data.email,
		password: data.password,
		phone: data.phone,
		company: data.company,
		address: data.address,
		eyeColor: data.eyeColor,
		age: data.age,
		name: {
			first: data.firstName,
			last: data.lastName
		},
		isActive: true,
		picture: data.picture || "http://placehold.it/32x32",
		balance: data.balance || "$5000"
	}
	return userObject;
}

app.get("/logout", asyncHandler(async function(req, res) {
	return res.clearCookie("jwt", cookieOptions).send("success");
}));

app.post('/login', asyncHandler(async function(req, res) {
	let email = req.body.email
	let existingUser = userExists(email);
	if(existingUser) {
		let existingPassword = existingUser.password;
		if(existingPassword === req.body.password) {
			const payload = {
				email: req.body.email,
				id: existingUser.id
			};
			jwt.sign(
				payload,
				keys.secretOrKey,
				{
				  expiresIn: 31556926 // 1 day in seconds
				},
				(err, token) => {
					return res.cookie("jwt", token, cookieOptions)
						.send("success")
				}
			);
		} else {
			return res.send(400).json("invalid account credentials")
		}
	} else {
		return res.send(400).json("invalid account credentials")
	}
}));

app.get('/account', passport.authenticate('jwt', {session: false}), asyncHandler(async function(req, res) {
	return res.send(req.user)
}))

app.put('/account', passport.authenticate('jwt', {session: false}), asyncHandler(async function(req, res) {
	let userId = req.user.id
	let updatedUserObject = createUserObject(userId, req.body);
	db.get('users')
		.find({ id: `${userId}` })
		.assign(updatedUserObject)
		.write()
	res.send(userId);
}));

app.post('/account', asyncHandler(async function(req, res) {
	let body = req.body;
	if(!body || !body.email || !body.password || !(typeof body.email === "string" && typeof body.password === "string"))
		return res.status(400).send(`{"status": "error", "message": "invalid data sent to server"`);
	if(userExists(body.email))
		return res.send(`{"status": "Error", "message": "An account with that email already exists"}`);
	//now can push into the database
	let userObject = createUserObject(shortid.generate(), body);
	db.get("users")
		.push(userObject)
		.write()
	return res.send(`{"status" : "Success"}`);
}))

app.get('/test.php', asyncHandler(async function(req, res) {
	//Get Zone id
	console.log("hi")
	// db.get("posts")
	// 	.push({id: shortid.generate(), title: "lowdb is awesome"})
	// 	.write()
	return res.cookie('testing','test').send(`{"live":"success"}`);
}));

let server = app.listen(process.env.SERVER_PORT)
	.on("close", message => console.log("close"))
	.on("connection", message => console.log("app now connected"))
	.on("error", error => console.log("error", error))
	.on("listening", error => console.log(`listening at http://${process.env.HOST}:${process.env.SERVER_PORT}`))
