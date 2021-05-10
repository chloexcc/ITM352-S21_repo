var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
const { request } = require('express');

app.use(session({secret: "ITM352 rocks!"}));

//play with sessions
app.get('/set_session',function (req, res, next) {
    res.send(`welcome, your session ID is ${req.session.id}`);
    next();
  });

//play with sessions
app.get('/use_session',function (req, res, next) {
    res.send(`Your session ID is ${req.session.id}`);
    req.session.distroy();
    next();
  });

//play with cookies
app.get('/set_cookie',function (req, res, next) {
  //console.log(req.cookies);
  let my_name = 'Dan Port';
  now = new Date();
  res.cookie('my_name', my_name,{expire: 5000 + now.getTimes()});  
  res.send(`Cookie for ${my_name} sent`);
  next();
});

//play with cookies
app.get('/use_cookie',function (req, res, next) {
    //console.log(req.cookies);
    if(typeof req.cookies ["username"] !='undefined'){
    res.send(`${req.cookies["username"]} is logged in`);
    } else{
    res.send("You are not logged in");
    }
    next();
  });

//var user_data = require('./user_data.json');
//Read userer data  file
var user_data_file = './user_data.json';
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    //console.log(`${user_data_file} has ${file_stats["size"]} characters`);
    var user_data = JSON.parse(fs.readFileSync('user_data.json', 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}

app.all('*', function (req, res, next) {
    //console.log(req);
    console.log(req.method, req.path);
    next();
});

app.post('./process_register', function (req, res,next) {
    //add a new user to the DB
    username = req.body["uname"];
    user_data[username] = {};
    user_data[username]["password"] = req.body["psw"];
    user_data[username]["email"] = req.body["email"];
    user_data[username]["name"] = req.body["fullname"];
    // save updated user_data to fuile (DB)
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    res.send(`${username} is registered`);
})


//console.log(user_data);


app.get("/login", function (request, response) {
    if(typeof request.cookies['username'] !='undefined'){ //can use in navbar
        logged_in=`${request.cookies['username']} is already loggin in`;
    }
    if(typeof request.session['last_login'] !='undefined'){
       last_log='Las login time was' + request.session['last_login'];
    }else{
        last_log="first time login";
    }

    console.log(request);
    // Give a simple login form
    str = `
<body>
${logged_in}
<br>
Last login:${last_log}
<form action="process_login" method="POST">
<input type="text" name="uname" size="40" placeholder="enter username" ><br />
<input type="password" name="psw" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

//This processed the login form
app.post('./process_login', function (request, response, next) {
    if(typeof request.session['last_login'] !='undefined'){
        console.log('Las login time was' + request.session['last_login']);
    }else{
        console.log("first time login");
    }
    request.session['last_login'] = Date();
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    if (typeof user_data[username_entered] != 'undefined') {
        if (user_data[username_entered]['password'] == password_entered) {
            respons .cookie('username',username_entered);
            response.send(`${username_entered} is loggedin`)
        } else {
            response.send(`${username_entered} password wrong`);
        }
    } else {
        response.send(`${username_entered} not found`);
    }
});

//This processed the registration form
app.post('./process_register', function (request, response, next) {
    response.send(request.body);
});

app.use(express.static('./static'));

var listener = app.listen(8080, () => { console.log('server started listening on port' + listener.address().port) });
 