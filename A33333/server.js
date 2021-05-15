//Referece: From lab14
var express = require('express');  //loads the express module
var app = express();  //create new express module 
var myParser = require("body-parser");  //extract incoming data of a POST request
app.use(myParser.urlencoded({ extended: true }));
var qs = require ('qs'); //used variable 'qs' as loaded module
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
var {check, validationResult} = require('express-validator');
var nodemailer = require('nodemailer');

const shift = 4; //shift for encyption
app.use(express.static('./public'));


var fs = require('fs'); // fs=file system, require= read/executes the file
//const { request } = require('http');

var user_data_file = './user_data.json';     
if(fs.existsSync(user_data_file)) {  //check if file exist

var user_data = JSON.parse(fs.readFileSync('./user_data.json','utf-8')); //read in the data, create user data object
} else {
   console.log(`${user_data_file} does not exist!`);
}

app.use(session({
    secret: 'ITM352 too easy',
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'cookieID',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

function isNonNegInt(q, return_errors = false) {
    error_msg = []; // assume no errors at fßßßßßßirst
    if (Number(q) == NaN) q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) error_msg.push('Not a number!'); // Check if string is a number value
    else if (Number(q) < 0) error_msg.push('Negative value!'); // Check if it is non-negative
    else if (parseInt(q) != q) error_msg.push('Not an integer!'); // Check that it is an integer
    return return_errors ? error_msg : (error_msg.length == 0);
}

const redirectLogin = (request, response, next) => {
    if(!request.session.userName){
        response.redirect('/login.html')
    }else{
        next()
    }
}

const redirectHome = (request, response, next) =>{
    if(request.session.userName){
        response.redirect('/products_display.html')
    }else{
        next()
    }
}



function encrypt(password){
    //-------encrypt the password -------//

    var encrypted = [];
    var encrypted_result = "";

    //encrypt the password
    for (var i = 0; i < password.length; i++){
        encrypted.push(password.charCodeAt(i)+shift);
        encrypted_result += String.fromCharCode(encrypted[i]);
    }
    return encrypted_result;
} 


//response to any HTTP method
app.all('*',  function(req,res,next){
    console.log(req.method, req.path);

    next();
});

app.get('/log-out', (request, response) => {
    request.session.destroy();
    return response.redirect('/login4.html?' + "logout=You have successfully logged out");
})

/*
app.get('/proceed-to-checkout', redirectLogin, (request, response) => {
    formData = request.body;


    var cart = request.session.cart;
    if(cart.length==0){
        return response.redirect('/shopping_cart.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname + "&error=Cart is empty");
    }

    response.redirect('/checkout.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname );
})


app.get('/go_to_cart', redirectLogin, (request, response) => {
	var cart = request.session.cart;


	response.redirect('/shopping_cart.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname );
})

*/

app.post('/purchase', (request, response) => {
    var formData = request.bdoy;

    var cart = request.session.cart;

    response.redirect('/invoice4.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname);
})

/*
app.post('/remove-from-cart', (request, response) => {
    var formData = request.body;

    var cart = request.session.cart;

    var foundItemIndex = cart.findIndex((item) => {
                return item.name == formData.name;
            }); 
    if(foundItemIndex >= 0) {
        cart.splice(foundItemIndex,1);

    }
    console.log(formData);
    response.redirect('/shoppingchart.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname );

})
*/

app.post('/product_selection_form', redirectLogin, (request, response) => {
	//take information from the client side
    var formData = request.body;
    //check if the quantity is a integer
    if(isNonNegInt(formData.quantity)) {
        formData.quantity = parseInt(formData.quantity);

        var cart = request.session.cart;
        //if there is a existing session.cart;
        if(cart) {
            //loop through the cart see if formData exists
            var foundItemIndex = cart.findIndex((item) => {
                return item.name == formData.name;
            });

            console.log(foundItemIndex);
            //if found
            if(foundItemIndex >= 0) {
                // Aggregate cart item
                var totalQuantity = cart[foundItemIndex].quantity + formData.quantity;
                cart[foundItemIndex].quantity = totalQuantity;

            } else {
                //if no formdata exists in the cart, then add to cart
                cart.push(formData);
            }

            request.session.cart = cart;

        } else {
            // if cart doesn't exists, create one and add formdata
            request.session.cart = [formData];
        }
    }else{
        //if the quantity entered is not a valid number, print the error in URL
        has_errors = true;
        console.log(error_msg);
        return response.redirect('/products_display.html?' +`error=` + error_msg + '&fullname=' + request.session.userName.fullname);
    }
    //if no error, prceed.
    console.log('Cart Items ', request.session.cart);
    return response.redirect('/products_display.html?' + qs.stringify(cart) + "&fullname="+ request.session.userName.fullname);
})
//------------processing login-----// Reference: Lab14
app.post('/process_login', function (request,response,next) {

    
    //console.log(request.query)
    //check login and password match database
    let username_entered = request.body["username"];
    let password_entered = request.body["password"];
    let encrypted_password_input = encrypt(password_entered)
    if(typeof user_data[username_entered] != 'undefined'){         
        if(user_data[username_entered]['password']==encrypted_password_input){
            //all good, send to invoice
            request.session.userName = user_data[username_entered];
            request.query["purchased"] = "true";
            request.query["fullname"] = request.session.userName.fullname;
            
            // console.log(request.session.userName);
            // console.log(request.session.userName.username);
            // console.log(request.session.userName.email);
            // console.log(request.session.userName.fullname);
          
            for (var items in request.query){
                if (parseInt(request.query[items])){
                    request.session.cart[items] = request.query[items];
                }
            }
            console.log("the session cart have ", request.session.cart);

            response.redirect('products_display.html?' + qs.stringify(request.query));
                } else{
            var failed = [];
            failed.push("Invalid username or password.");
            request.query.failed = failed.join("<br />");
            console.log(failed);
            response.redirect('login.html?' + qs.stringify(request.query));

        }
        }else{
            var failed = [];
            failed.push("Invalid username or password.");
            request.query.failed = failed.join("<br />");
            console.log(failed);
            response.redirect('login.html?' + qs.stringify(request.query));

        }

});

//--------processing register -----------//
app.post('/process_register', function (request,response,next) {


    //-------username validation---------//
    const violations = [];

    //check if the username is blank
     if (request.body.username == ''){
        violations.push("- The username cannot be blank.");

        
    }
    //check the length of the username
    if(request.body.username.length < 5 || request.body.username.length > 10){
        violations.push("- The username must be between 5 to 10 characters long");
        
    } 
    //check if username contains only letters and numbers
    if (/^[0-9a-zA-Z]+$/i.test(request.body.username) == false){
        violations.push("- The username must be contains only letters and numbers");
        
    }
    //check for duplicate usernames
    for (var i in user_data){
        if(i == request.body.username){
            violations.push("- Username already exists.");
            
        }
    }

    //-------password validation -------//


    //check if the password is blank
    if (request.body.password == ''){
        violations.push("- The password field cannot be blank.");
    }
    //check if both password and confirmed password is the same
    if (request.body.password_repeat !== request.body.password){
        violations.push("- The passwords you have entered does not match.");
    }
    //check the length of the password
    if (request.body.password.length < 6){
        violations.push("- The password must be at least 6 characters long");
    }

    //------email address validation------//

    //check if the email field is blank
    if (request.body.email == ''){
        violations.push("- The email field cannot be blank");
    }

    //check if the email is in proper format.
    if (/^[^\s@]+@[^\s@]+$/.test(request.body.email) == false){
        violations.push("- The email address you entered is not in valid format.");
    }

    //--------full name validation -------//

    //check if the name contains only letters.
    if (/^[A-Za-z]+$/i.test(request.body.fullname) == false){
        violations.push("- The full name must be contain only letters.");
    }

    let encrypted_pass = encrypt(request.body.password);

    if (violations.length === 0){
         username = request.body.username.toLowerCase();
          user_data[username] = {}; 
          user_data[username].username=request.body["username"];
          user_data[username].fullname=request.body.fullname;
          user_data[username].email= request.body.email;
          user_data[username].password = encrypted_pass;
          //user_data[username].repeat_password = request.body.password_repeat;
          request.query["username"] = username;
         fs.writeFileSync(user_data_file, JSON.stringify(user_data));
         request.session.userName = username;
         console.log(request.session.userName);
         console.log(qs.stringify(request.query));

         response.redirect('/products_display.html' );

    }else if (violations.length > 0){
        console.log(violations.join(' '));
        //response.send(violations.join(' '));

        request.query.violations = violations.join("<br />");
        response.redirect('register.html?' + qs.stringify(request.query));
    }

    
      //if password wrong direct to login 
      // request.query['password_wrong'] = 'true';
      // response.redirect('login.html?' + qs.stringify(request.query));
    });


app.get('/shoppingchart.html',redirectLogin, function (request,response,next) {
    //console.log(request.session.userName);
    //console.log("shopping_cart");
    
});

app.get('/invoice4.html', function(request, response, next){
    if(!request.session.userName){
        response.redirect('/login.html');
    }else{
        next();
    }
})


//rounting path 
var listener =app.listen(8080, () => {console.log(`listening on port `+listener.address().port)});