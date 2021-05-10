const express = require('express');
const app = express();
const myParser = require('body-parser');
const qs = require('qs');
const session = require('express-session');
const ejsmate = require('ejs');

app.set('view engine', 'ejs');
app.use(myParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'ITM352 too easy',
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'cookieID',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


// load the JSON file
var fs = require('fs'); // fs=file system, require= read/executes the file
//const { request } = require('http');

var user_data_file = './user_data.json';     
if(fs.existsSync(user_data_file)) {  //check if file exist

var user_data = JSON.parse(fs.readFileSync('./user_data.json','utf-8')); //read in the data, create user data object
} else {
   console.log(`${user_data_file} does not exist!`);
}


//response to all HTTP request, and initialize the session.cart
app.all('*',  function(request,response,next){
    console.log(request.method, request.path);
    

    //console.log(req.session.cart);
    next();
});


function encrypt(password){
    //-------encrypt the password -------//
    const shift = 4;
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
    //if user is not logged in, redirect to login page
    if(!request.session.userName){
        response.redirect('login');
    }else{
        //redirect to destination if logged in.
        next();
    }
}


const redirectHome = (request, response, next) => {
    //redirect user to products page if already logged in
    if(request.session.userName){
        response.redirect('products');
    }else{
        //redirect to destination if not logged in.
        next();
    }
}

function isNonNegInt(q, return_errors = false) {
    error_msg = []; // assume no errors at fßßßßßßirst
    if (Number(q) == NaN) error_msg.push('Please input an quantity'); // handle blank inputs as if they are 0
    if (Number(q) != q) error_msg.push('Not a number!'); // Check if string is a number value
    else if (Number(q) < 0) error_msg.push('Negative value!'); // Check if it is non-negative
    else if (parseInt(q) != q) error_msg.push('Not an integer!'); // Check that it is an integer
    return return_errors ? error_msg : (error_msg.length == 0);
}

//go to the index page
app.get('/', (request, response) => {
	return response.render('index');
})

//go to the products page,
app.get('/products', (request, response) => {
	return response.render('products', {username: request.session.userName});
})

//go to the login page, redirect to home if logged in.
app.get('/login',redirectHome, (request,response) => {
	return response.render('login');
})

//go to the register page, redirect to home if logged in.
app.get('/register', redirectHome,(request, response) => {
	return response.render('register');
})

//go to the invoice page, redirect to login if not logged in
app.get('/invoice', redirectLogin, (request, response) => {
    return response.render('invoice', {username: request.session.userName, cart: request.session.cart || []});
})

//go to the shopping cart page, redirect if not logged in
app.get('/cart', redirectLogin, (request, response, next) => {
    //console.log(request.session.cart);
    return response.render('cart', {username: request.session.userName, cart: request.session.cart || []});
});

//go to the checkout page, redirect if not loggin in
app.get('/checkout', redirectLogin, (request, response) => {
    return response.render('checkout', {username: request.session.userName, cart: request.session.cart || []});
})

app.get('/cancel', (request, response) => {
    return response.redirect('products');
})

app.get('/logout', (request, response) => {
    request.session.destroy();
    return response.redirect('login');
})



app.post('/proceed-to-checkout'), (request, response) => {
    formData = request.body;

    response.redirect('/checkout');
}

app.post('/purchase', (request, response) => {
    formData = request.body;

    response.redirect('/invoice');
})

app.post('/add-to-cart', redirectLogin, (request, response) => {
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
                return item.productId == formData.productId;
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
        return response.redirect('products?' +`error-${formData.type}=` + error_msg);
    }
    //if no error, prceed.
    console.log('Cart Items ', request.session.cart);
    return response.redirect('/products?' + `${formData.type}=` + formData.quantity);
})



app.post('/remove_item', redirectLogin, (request, response) =>{
    

    var formData = request.body;
    
    //console.log("the selected index is" ,formData);

    var cart = request.session.cart;

    //find the product index in session.cart
    var foundItemIndex = cart.findIndex((item) => {
        return item.productId == formData.productID;

    })
    //console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //remove the index
        cart.splice(foundItemIndex, 1);
    }


    return response.redirect('/cart');

});       
               
    
//------------processing login-----// Reference: Lab14
app.post('/process_login', (request, response, next) => {
    const failed = [];

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

            response.redirect('products');
                } else{
            failed.push("Invalid username or password.");
            request.query.failed = failed.join("<br />");
            console.log(failed);
            response.redirect('login' + '?' + qs.stringify(request.query));

        }
        }else{
            failed.push("Invalid username or password.");
            request.query.failed = failed.join("<br />");
            console.log(failed);
            response.redirect('login' + '?' + qs.stringify(request.query));

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
    for (var username in user_data){
        if(username == request.body.username){
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

         response.redirect('products' );

    }else if (violations.length > 0){
        console.log(violations.join(' '));
        //response.send(violations.join(' '));

        request.query.violations = violations.join("<br />");
        response.redirect('register' + '?' + qs.stringify(request.query));
    }

    
      //if password wrong direct to login 
      // request.query['password_wrong'] = 'true';
      // response.redirect('login.html?' + qs.stringify(request.query));
    });

//rounting path 
var listener =app.listen(8080, () => {console.log(`listening on port `+listener.address().port)});