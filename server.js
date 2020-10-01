//loading modules
const querystring = require('querystring');
const express = require('express');
const https = require('https');
const fs = require('fs');

//creating our server
const server=express();

//middleware
server.use(express.json()); // to recognize the incoming request object as JSON object

// required parameters to Authorize our app with google APIs
const client_id=ADD YOUR CLIENT_ID;  //YOUR PROJECT CLIENT ID  		 #CHANGE with your own project credentials
const client_secret=ADD YOUR CLIENT_SECRET;//YOUR PROJECT CLIENT SECRET  	 #CHANGE with your own project credentials

const scope = "https://www.googleapis.com/auth/gmail.send";
const redirect_uri="http://localhost:8080";                                                
const response_type = "code";

var authorization_code="";
var access_token="";

//Authorizing our server with google
server.get('/authorize',(req,res)=>{
	var authURL = "https://accounts.google.com/o/oauth2/v2/auth?"+ 
	"client_id=" + client_id +
	"&scope=" + scope +
	"&redirect_uri=" + redirect_uri +
	"&response_type=" + response_type;

	res.redirect(authURL);
});

// endpoint where we are redirected after authorization and accessing token
var options = {
	host:'oauth2.googleapis.com',
	port:443,
	path:'/token',
	method:'POST',
	headers:{
		'Content-Type':'application/x-www-form-urlencoded'
	}
}
var post_req =https.request(options, function(res){
      res.setEncoding('utf8');
      res.on('data', function(chunk){
      	  fs.writeFileSync('token.json',chunk);  //storing access token in token.js file
      });
  });
server.get('/',(req,res)=>{
	if(req.query.error=="access_denied"){return res.send("Access denied by the user");}
	authorization_code=req.query.code;
	if(authorization_code!=""){
		var post_data=querystring.stringify({
	      "client_id":client_id,
	      "client_secret":client_secret,
	      "code":authorization_code,
	      "grant_type":"authorization_code",
	      "redirect_uri":redirect_uri
		});
		post_req.write(post_data);    // to get access token
		post_req.end();
		}
	 res.send("success")
	});

//after getting access token and storing it in a file 	
server.post('/email',(req,res)=>{
	fs.readFile('token.json', function read(err, data) {
      if (err) {
        throw err;
       }
    access_token=JSON.parse(data).access_token;
	});
	setTimeout(()=>{
	var mail = new Buffer.from(
	     "To:"+req.body.to+"\n"+
	     "Subject:"+req.body.subject+"\n\n"+

		 req.body.message
	).toString("base64").replace(/\+/g,'-').replace(/\//g,'_')
	var post2 = {
	hostname:'www.googleapis.com',
	port:'443',
	path:'/gmail/v1/users/me/messages/send',
	method:'POST',
	headers:{
		"Authorization" : "Bearer "+ access_token,
		"Content-Type" : "application/json"
	}
	}
	var post_req1 = https.request(post2,function(res){
		res.setEncoding('utf8');
		res.on('data',function(chunk){
			console.log("response_type   "+chunk);
		})
	})
	post_req1.write(JSON.stringify({"raw":mail}))
	post_req1.end()
	res.send("successfully sent mail to "+req.body.to)
	},3000);
});
server.listen(8080,()=>{
	console.log('app listening to port '+8080);
})