// Chloe and Caixin's server.js
// Some parts are borrowed and modified by Assignement 1, Assignment 2, Lab 14, and Professor Port's sceencast.
var data = require('./static/products.js');
var allProducts=data.allProducts;
const queryString = require('qs');
var express = require('express');  
var app = express();
var myParser = require("body-parser");  
var filename = 'user_data.json';
var fs = require('fs');
const{request} = require('express');
var cookieParser = require('cookie-parser');
app.use(cookieParser()); 
var session = require('express-session');


//var {check, validationResult} = require('express-validator');
const { type } = require('os');
const shift = 4; //shift for encyption


app.use(session({
    secret: 'I love ITM352, I LOVE YOU, I LOVE TA.',
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'cookieID',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));



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


//-------encrypt the password -------//
function encrypt(password){
 	var encrypted = [];
 	var encrypted_result = "";

 	//encrypt the password
 	for (var i = 0; i < password.length; i++){
 		encrypted.push(password.charCodeAt(i)+shift);
 		encrypted_result += String.fromCharCode(encrypted[i]);
 	}
 	return encrypted_result;
}

const redirectLogin = (request, response, next) => {
  if(!request.session.userName){
      response.redirect('/login.html')
  }else{
      next()
  }
}

app.get('/log-out', (request, response) => {
  request.session.destroy();
  return response.redirect('/login.html?' + "logout=You have successfully logged out");
})

//---add item to shopping cart, get help from Professor port----//
app.post('/add_cart',  redirectLogin, function(request,response){
  console.log(request.body);
  var count;
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['quantity']);
  var formData_price = parseInt(request.body['price']);
  
  formData = {ptype: ptype, name: formData_name, price: formData_price, quantity: formData_quantity};


  var cart = request.session.cart;
  if (isNonNegInt(formData_quantity)){
    if(cart){

    var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });

    if(foundItemIndex >= 0) {
                // Aggregate cart item
                var totalQuantity = cart[foundItemIndex].quantity + formData.quantity;
                cart[foundItemIndex].quantity = totalQuantity;

            } else { 
              
              cart.push(formData);
              count = request.session.cart.length;
            }

  }else{
    request.session.cart = [formData];
  }
}else{
  response.redirect(`display.html?productType=${ptype}&fullname=${request.session.userName.name}&count=${count}&errors=${errors}`);
}
  

  //console.log('the cart have' ,request.session.cart);
  response.redirect(`display.html?productType=${ptype}&fullname=${request.session.userName.name}&count=${count}`);
});

app.post("/get_cart", function (request, response) {
  response.json(request.session.cart);
});



app.post('/add_one', function(request, response){
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['add']);
  var cart = request.session.cart;

  var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });
    console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //remove the index
        console.log(cart[foundItemIndex].quantity);
        var newTotal = cart[foundItemIndex].quantity + formData_quantity;
        console.log(newTotal);
        cart[foundItemIndex].quantity = newTotal;
    }

  console.log(cart);


  return response.redirect("/shoppingchart.html");

});

app.post('/remove_one', function(request, response){
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['reduce']);
  var cart = request.session.cart;

  var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });
    console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //remove the index
        console.log(cart[foundItemIndex].quantity);
        if(cart[foundItemIndex].quantity > 0){
          var newTotal = cart[foundItemIndex].quantity - formData_quantity;
          console.log(newTotal);
          cart[foundItemIndex].quantity = newTotal;
        }else{
          cart.splice(foundItemIndex, 1);
        }
        
    }

  console.log(cart);


  return response.redirect("/shoppingchart.html");

});


app.post('/remove-from-cart', (request, response) =>{
    

    var formData_name = request.body["ProductName"];
    
    //console.log("the selected index is" ,formData);

    var cart = request.session.cart;

    //find the product index in session.cart
    var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;

    })
    //console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //remove the index
        cart.splice(foundItemIndex, 1);
    }


    return response.redirect('/shoppingchart.html');

});       


//this process the login form
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    
    the_username = req.body.username.toLowerCase(); //username in lowercase
    the_password = req.body.password;
    let encrypted_password_input = encrypt(the_password);
    if (typeof user_data[the_username] != 'undefined') { //matching username
        if (user_data[the_username].password == encrypted_password_input) {
            console.log(req.query);
            req.query.username = the_username; 
            console.log(user_data[req.query.username].name);
            req.session.userName = user_data[the_username];
            req.query.name = user_data[req.query.username].name
            res.redirect('/invoice4.html?' + queryString.stringify(req.query));
            console.log(req.session.userName);
            return; // all good, send to invoice
        } else { //password wrong, show invalid password
            LogError.push = ('Invalid Password');
            console.log(LogError);
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

    if (/^[A-Za-z]+$/.test(req.body.name)) { //full name on name part
    }
    else {
      errors.push('Use Only Letters for Full Name')
    }

    if (req.body.name == "") {
      errors.push('Invalid Full Name');// full name is invalid if put wrong
    }

     if ((req.body.fullname.length > 20 && req.body.fullname.length <1)) {
    errors.push('Full Name Too Long')// fullname length :1-20
  }
  
    var reguser = req.body.username.toLowerCase(); //username in lowercase
    if (typeof user_data[reguser] != 'undefined') {
      errors.push('Username taken')
    }
    
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {//username only letter and number
    }
    else {
      errors.push('Username: Letters And Numbers Only')
    }

    
    if (req.body.password.length < 6) {//password length: 6 characters or more
      errors.push('Password: At least 6 Characters and/or Numbers Required')
    }
   
    if (req.body.password !== req.body.repeat_password) {  // matching password
      errors.push('Password Not Match')
    }
   
    if (errors.length == 0) { // Save user's refister information if no error
      POST = req.body
      console.log('no errors')

      username = POST['username']
      

//-------encrypt the password -------//
function encrypt(password){
  var encrypted = [];
  var encrypted_result = "";

  //encrypt the password
  for (var i = 0; i <password.length; i++){
    encrypted.push(password.charCodeAt(i)+shift);
    encrypted_result += String.fromCharCode(encrypted[i]);
  }
  return encrypted_result;
}


      let encrypted_pass = encrypt(req.body.password);

      user_data[username] = {}; 
      user_data[username].name = req.body.fullname;
      user_data[username].password= encrypted_pass;
      user_data[username].email = req.body.email;
      data = JSON.stringify(user_data); 
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./invoice4.html?' + queryString.stringify(req.query));
    }
    
    else{ //if error occurs, direct to register page
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query));
    }
});



function isNonNegInt(q, returnErrors = false) { //value are integer
    errors = [];  
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // string is a number
    if (parseInt(q) < 0) errors.push('Negative value!'); //value is positive
    if (parseInt(q) != q) errors.push('Not an integer!'); //value is an integer
    return returnErrors ? errors : (errors.length == 0);
}

//server side
app.use(express.static('./static')); 
app.listen(8080, () => console.log(`listening on port 8080`)); // listen on port 8080 