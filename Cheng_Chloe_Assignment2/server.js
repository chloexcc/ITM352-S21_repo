var data = require('./static/products.js');
var products_array = data.products;
const queryString = require('qs');
var express = require('express');  
var app = express();
var myParser = require("body-parser");  
var filename = 'user_data.json';
var fs = require('fs');
const{request} = require('express');


app.all('*',function(request,response,next){
    console.log(request.method + 'to' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

if(fs.existsSync(filename)) {
    var file_stats =fs.statSync(filename);
    console.log(filename + 'has' + file_stats.size + 'characters!');
    data = fs.readFileSync(filename,'utf-8'); //read in the data
    user_data = JSON.parse(data);
} else {
    console.log(filename + ' does not exist!');
}


//this process the login form
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase(); //input username in lowercase
    if (typeof user_data[the_username] != 'undefined') { //matching username/leave undefined
        if (user_data[the_username].password == req.body.password) {
            console.log(req.query);
            req.query.username = the_username; 
            console.log(user_data[req.query.username].name);
            req.query.name = user_data[req.query.username].name
            res.redirect('/invoice4.html?' + queryString.stringify(req.query));
            return; // //check login username and password match database, all good, send to invoice
        } else { //show invalid password if input a wrong password
            LogError.push = ('Invalid Password');
            console.log(LogError);
            req.query.username= the_username;
            req.query.name= user_data[the_username].name;
            req.query.LogError=LogError.join(';');
        }
        } else { //push to the user invalid username if username is incorrect 
            LogError.push = ('Invalid Username');
            console.log(LogError);
            req.query.username= the_username;
            req.query.LogError=LogError.join(';');
        }
    res.redirect('./login.html?' + queryString.stringify(req.query));
});

//this process the register form
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) { //must enter full name on name part
    }
    else {
      errors.push('Use Only Letters for Full Name')
    }

    if (req.body.name == "") {
      errors.push('Invalid Full Name');// telling full name is invalid if put wrong
    }
    
     if ((req.body.fullname.length > 20 && req.body.fullname.length <1)) {
    errors.push('Full Name Too Long')// the length of full name has to be 1-20
  }
  //Check the new username in lowercase among other usernames
    var reguser = req.body.username.toLowerCase(); 
    if (typeof user_data[reguser] != 'undefined') { //shows username taken if the username is undefinced or the username is been taken 
      errors.push('Username taken')
    }
    //username only input letter and number
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Username: Letters And Numbers Only')
    }
  
    //password length has to be at least 6 characters
    if (req.body.password.length < 6) {
      errors.push('Password: At least 6 Characters and/or Numbers Required')
    }
    // check the repeat password match to the password
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not Match')
    }
    //Some parts are from Lab 14. Save the user's refister information if there is no error
    if (errors.length == 0) {
      POST = req.body
      console.log('no errors')
      var username = POST['username']
      user_data[username] = {}; //user's information registration
      user_data[username].name = req.body.fullname;
      user_data[username].password= req.body.password;
      user_data[username].email = req.body.email;
      data = JSON.stringify(user_data); 
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./invoice4.html?' + queryString.stringify(req.query));
    }
    //if error occurs, log the user to the console and direct them to register page
    else{
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query));
    }
});


//Processing the purchase and rendering the invoice on the server, some part from assignment1
app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data will be in the body

//check if quantities are NonNegInt
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasvalidquantities=true; // Assume the created variable is true
        var hasquantities=false
        for (i = 0; i < products.length; i++) {
            
    qty=POST[`quantity${i}`];
        hasquantities=hasquantities || qty>0; // is valid (quantity) if the value > 0
        hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // is valid if it is both a quantity > 0  
        } 

        // go to the invoice if all quantities are valid
        const stringified = queryString.stringify(POST);
        if (hasvalidquantities && hasquantities) {
          response.redirect("./login.html?"+stringified);
          return; 
        }  
        else { 
            response.redirect("./products_display.html?" + stringified) 
        }
    }
});

//repeating the isNonNegInt from the products_display page
function isNonNegInt(q, returnErrors = false) { //check the value are integer
    errors = []; // assume no error in quantity 
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); //check the string is a number
    if (q < 0) errors.push('Negative value!'); //check the value is a not negative
    if (parseInt(q) != q) errors.push('Not an integer!'); //check the value is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./static')); 
app.listen(8080, () => console.log(`listening on port 8080`)); // listen on port 8080