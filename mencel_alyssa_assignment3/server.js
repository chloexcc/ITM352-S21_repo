/* 
Alyssa Mencel's Assignment 3 server 
made with previous components from assignment 1 and assignment 2 
*/

var data = require('./public/products.js'); //load the products file and setting it to variable data 
var allProducts = data.allProducts; //setting the variabel allProdcuts to the allProducts data in products.js
const queryString = require('query-string'); //using the query-string
var express = require('express'); //using the express module
var app = express(); //setting the variable app to express module 
var myParser = require("body-parser"); //using the body parser module
var fs = require('fs'); //using the fs module 
var user_info_file = './user_data.json'; //setting the user_data file to user_info_file
var userdata_file = fs.readFileSync(user_info_file, 'utf-8'); //assigneing the userdata as a string variable 
userdata = JSON.parse(userdata_file); //the json is then parsed and string is turned into object 
var cookieParser = require('cookie-parser'); //using the cookie-parser
var session = require('express-session'); //using the express-session module 
app.use(myParser.urlencoded({ extended: true })); //putting data in the body 
const nodemailer = require("nodemailer"); //using the node mailer module 

app.use(cookieParser()); //using cookie-parser middleware

//for all requests, it writes it in the console and then moves on
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path); 
    next(); 
});

/*this is used to take info from cart.html
the server will generate the invoice and send email to user
then the invoice will be displayed in the page*/ 
app.post("/generateInvoice", function (request, response) {
    cart = JSON.parse(request.query['cartData']); //this parses the cart 
    cookie = JSON.parse(request.query['cookieData']); //this parses the cookies 
    var theCookie = cookie.split(';');
    for (i in theCookie) {
        //function from stackoverflow.com
        function split(theCookie) { //split the cookie (before "=")
            var i = theCookie.indexOf("="); 

            if (i > 0)
                return theCookie.slice(0, i);//takes off the string after the =
            else {
                return "";
            }
        };

        var key = split(theCookie[i]); 

        //this sets the username to the variable theUsername 
        if (key == ' username') {
            var theUsername = theCookie[i].split('=').pop(); 
        };
        //sets the variable to email 
        if (key == ' email') { 
            var email = theCookie[i].split('=').pop(); 
        };

    }
    console.log(email);
    console.log(theUsername);
    console.log(theCookie);

    /*
    this creates a string of the invoice from cart.html
    this is what is emailed to the user
    used with help from previous invoice.html 
    */

    str = 
    `<link rel="stylesheet" href="css/skel.css" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/style-xlarge.css" />
    <header align="center">
    <!-- Center header on page -->
    <h1>Purchase Complete</h1>
    <hr /> <!-- Purchase Complete -->
    </header>
    <header id="header" class="skel-layers-fixed">
        <h1><a href="index.html">Sustainable Outfitters</a></h1>
        <nav id="nav">
            <ul>
                <li><a href="./index.html">Home</a></li>
                <li><a href="./login.html">Login</a></li>
                <li><a href="./register.html">Register</a></li>
                <li><div class="dropdown">
                    <a class="dropbtn" href="./products_display.html">Products</a>
                    <div class="dropdown-content">
                        <a href="bath.html">Bath</a> <br>
                        <a href="home.html">Home</a> <br>
                        <a href="kitchen.html">Kitchen</a> <br>
                        <a href="kits.html">Kits</a> <br>
                        <a href="extra.html">Extra</a>
                    </div>
                  </div>
                </li>
                <li><a href="./cart.html">Shopping Cart</a></li>
            </ul>
        </nav>
    </header>
        <h3 align="center">Thank you for your purchase, <font color="#629DD1">${theUsername}!</font><br />An email copy has been sent to <font color="#629DD1">${email}</font></h3>
    
        <!-- template taken from first invoice on assignment1 -->
        <section id="one" class="wrapper style1">
                <!--start of invoice table--> 
          <table>
            <tbody>
            <tr>
                            <td style="text-align: left;" width="40%"><strong>Product</strong></td>
                            <td width="20%"><strong>Quantity</strong></td>
                            <td width="20%"><strong>Price</strong></td>
                            <td width="20%"><strong>Extended Price</strong></td>
                        </tr>`;

            subtotal = 0; //subtotal starts off as 0
            for (product in allProducts) {
                for (i = 0; i < allProducts[product].length; i++) {

                    qty = cart[`${product}${i}`];
                    if (qty > 0) { //if a quantity is entered in the textbox 
                        extended_price = qty * allProducts[product][i].price //equation for extended price
                        subtotal += extended_price; //adds each subtotatl to get the the extrended price 

                        str+=`
                        <tr>
                            <td style= "text-align: left" width="40%">${allProducts[product][i].name}</td>
                            <td width="20%">${qty}</td>
                            <td width="20%">\$${allProducts[product][i].price}</td>
                            <td  width="20%">\$${extended_price.toFixed(2)}</td>
                        </tr>
                    `;
                    }
                };
            }
            //compute tax information
            var tax_rate = 0.0471;
            var tax = tax_rate * subtotal; 
            // Compute shipping
            if (subtotal <= 50) {
                shipping = 2;
                }
             else if (subtotal <= 100) {
              shipping = 5;
            }
             else {
              shipping = 0.05 * subtotal; // 5% of subtotal
              }
            // Compute grand total
              var total = subtotal + tax + shipping;
            
              str+=`
              <tr>
              <td colspan="4" width="100%">&nbsp;</td>
            </tr>
            <tr>
              <td colspan="3" width="67%">Sub-total</td>
              <td width="54%">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td  colspan="3" width="67%"><span>Tax at ${100*tax_rate}%</span></td>
              <td width="54%">${tax.toFixed(2)}</td>
            </tr>
            <tr>
                <td  colspan="3" width="67%">Shipping</span></td>
                <td width="54%">${shipping.toFixed(2)}</td>
              </tr>
            <tr>
              <td colspan="3" width="67%"><strong>Total</strong></td>
              <td width="54%"><strong>${total.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="4"> <strong>OUR SHIPPING POLICY IS: A subtotal $0 - $49.99 will be $2 shipping
                A subtotal $50 - $99.99 will be $5 shipping
                Subtotals over $100 will be charged 5% of the subtotal amount</strong>
              </td>
          </tr>
      </tbody>
        </table> 
      </section>`;
                

    //this code was made with help from assignment 3 example 
    var transporter = nodemailer.createTransport({ //create the transporter variable
        host: 'mail.hawaii.edu', //note on itmvm webserver have to use the mail from hawaii.edu
        port: 25,
        secure: false, //use tls
        tls: {
            //do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'alyssamencel@gmail.com', //sends the invoice from my email, alyssamencel@gmail.com
        to: email, //sends the email to cookie from the account that was logged in
        subject: 'Invoice',
        html: str //the string then returns as html 
    };
    //notification in console if errors in sending email or if it sent properly 
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { 
            console.log(error);
        } else { 
            console.log('Email sent: ' + info.response);
        }
    });

    response.send(str); // string goes to be displayed in browser
});

//Used with help from lab15 and stormpath.com 
app.use(session({ //
    secret: 'ITM352 Rocks!', //encrypts the session 
    resave: true, //saves the session
    saveUninitialized: false, //deletes or forgets session when it is done
    httpOnly: false, //doesnt allow access of cookies 
    secure: true, //only uses cookies in HTTPS
    ephemeral: true //this deletes this cookie when browser is closed 
}));
//process the quantity_form when POST request is made
app.post("/process_form", function (request, response) { 
    let POST = request.body; // data is in the body 

    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
        var validAmount = true; //make the variable validAmount true 
        var amount = false; //make the variable amount equal to false 

        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { //for any product
            qty = POST[`quantity_textbox${i}`]; //sets the variable qty to quantity textbox 

            if (qty > 0) {
                amount = true; //if greater than 0 it is goog 
            }

            if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
                validAmount = false; // it is not a valid amount
            }

        }

        const stringified = queryString.stringify(POST); //converts data from POST to JSON string 

        if (validAmount && amount) { //if it is a quanity and greater than 0
            response.redirect("./login.html?" + stringified); // redirect the page to login page if not logged in 
            return; //stops function
        }

        else { response.redirect("./index.html?" + stringified) } //if there is invalid sends back to home page with the string 

    }

});

//repeats the isNonNegInt function
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative number</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full product</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

//Made with help from Lab 14 Exercise 3
app.post("/check_login", function (request, response) {// Process login form from POST Request
    errs = {}; //assume no errors at first
    var login_username = request.body["username"]; //set var login_username to the username 
    var user_info = userdata[login_username]; //sets a variable
    var login_password = request.body["password"]; //sets a variable

    if (typeof userdata[login_username] == 'undefined' || userdata[login_username] == '') { // If the username is defined
        errs.username = '<font color="red">Incorrect Username</font>'; //If invalid usersername doesnt match 
        errs.password = '<font color="red">Incorrect Password</font>'; //If username does not match anything in json file, password cannot match username
    } else if (user_info['password'] != login_password) {
        errs.username = ''; //remove error
        errs.password = '<font color="red">Incorrect Password</font>'; //wrong password still
    } else {
        delete errs.username; //remove error
        delete errs.password; //remove error
    };

    if (Object.keys(errs).length == 0) { //If no errors exist 
        //Used with help from Lab15 Exercise4 
        session.username = login_username; //adds username to the session 
        var theDate = Date.now(); //adds the login time 
        session.last_login_time = theDate; //this login is saved in a session 
        var login_name = user_info['name']; //sets a variable 
        var user_email = user_info['email']; //sets a variable
        response.cookie('username', login_username) //puts the username in a cookie
        response.cookie('name', login_name) //puts the name in a cookie 
        response.cookie('email', user_email); //puts the email in a cookie 
        response.json({}); //parses it into a json object 
    } else {
        response.json(errs); //if fails it shows errors 
    };

});

/*
the following two functions validate the information in the form 
made with help from w3resource.com 
*/ 
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //email can only contain letter, numbers, @ symbo 
    if (inputText.match(mailformat)) { //the input must match above requirements to be a valid email 
        return true; 
    }
    else {
        return false; //email is invalid 
    }
}


function isAlphaNumeric(input) {
    var letterNumber = /^[0-9a-zA-Z]+$/; //can only be variables or numbers 
    if (input.match(letterNumber)) { //the input must match above requirements 
        return true;
    }
    else { 
        return false; //it is invalid 
    }
}

//Made with help from Lab 14 Exercise 4
app.post("/register_user", function (request, response) {
    // processing a registration form 
    errs = {}; //assume no errors at first
    var registered_username = request.body["username"]; //set variable 
    var registered_name = request.body["name"]; //set variable 

    // this section is for the username  
    if (registered_username == '') { //username is required
        errs.username = '<font color="red">Please Enter A Username</font>';
    } else if (registered_username.length < 4 || registered_username.length > 10) { //the username has to be between 4 and 10 characters 
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>'; //error messgae if not 
    } else if (isAlphaNumeric(registered_username) == false) { //username can only be letters and numbers 
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; //error if not
    } else if (typeof userdata[registered_username] != "undefined") { //checks if username is taken
        errs.username = '<font color="red">Username Taken</font>'; //error if taken 
    } else {
        errs.username = null;
    }

    //this section is for the name 
    if (registered_name.length > 30) { //name has to be shorter than 30 
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    }

    //this section is for the password
    if (request.body.password.length == 0) { //requirement 
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //password is at least 6 characters 
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//checks if repeat field is same
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; //error if passwords don't match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    //this section is for the email
    if (request.body.email == '') { //requirement 
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }

    //Made with help from stackoverflow.com 
    let result = !Object.values(errs).every(o => o === null); 
    console.log(result); 

    if (result == false) { //when there are no errors 
        //sets the below to what the user entered 
        userdata[registered_username] = {}; 
        userdata[registered_username].name = request.body.name; 
        userdata[registered_username].password = request.body.password; 
        userdata[registered_username].email = request.body.email; 
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2));
        response.cookie("username", registered_username); 
        response.cookie("name", registered_name); 
        response.cookie("email", request.body.email); 
        response.json({}); 
    } else {
        response.json(errs); 
    }

});

app.post('/logout', function (request, response) { 
    request.session.reset(); 
    response.redirect('/index.html'); 
});

app.use(express.static('./public')); //everythin is in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); //runs on port 8080 