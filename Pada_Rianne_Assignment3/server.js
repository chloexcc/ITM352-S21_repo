// Rianne Pada
//My server for assignment 3
// Runs all the pages on the class server and local host
var data = require('./public/products.js'); //get the data from products.js
var products = data.products;

// So it'll load querystring// 
const querystring = require('querystring');
const queryString = require('query-string'); // load querystring// 
var filename = 'user_data.json'; // setting filename
var fs = require('fs'); //Load file system//
var express = require('express'); //Need express to run certain parts//
var app = express(); 
var myParser = require("body-parser");
//REFERENCED DANIEL PORT LAB 15 + A3 EXAMPLES
var cookieParser = require('cookie-parser'); //Need cookie-parser to use cookies
var nodemailer = require('nodemailer'); //nodemailer sends out the invoice emails
var path = require('path');
app.use(cookieParser());

var session = require('express-session');
 app.use(cookieParser()); // setting up the cookie/session

 // REFERENCED FROM DANIEL PORT A3 EXAMPLES AND LAB 15
app.use(session({ //
    secret: 'ITM352 Rocks!', //encrypts the session 
    resave: true, //saves the session
    saveUninitialized: false, //deletes or forgets session when it is done
    httpOnly: false, //doesnt allow access of cookies 
    secure: true, //only uses cookies in HTTPS
    ephemeral: true //this deletes this cookie when browser is closed 
}));
 
 app.use(myParser.urlencoded({ extended: true }));

// Checks if file exists
if (fs.existsSync(filename)) {
  data = fs.readFileSync(filename, 'utf-8');
  //console.log("Success! We got: " + data);

  var user_data = JSON.parse(data);
  console.log("User_data"); // logs that user_data exists
} else {
  console.log("Sorry can't read file " + filename);
  exit(); // if it doesn't exist, console logs that the file cannot be found and read
}
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path)
    next();
});
// creates cookie


// Allows us to load in the cart page
//REFERENCED FROM DANIEL PORT OFFICE HOUR APPOINTMENT 12/14
app.get("/cart.html", function (request, response) {
    cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
    cartfile += fs.readFileSync('./public/cart.html', 'utf-8'); // add it onto the cart page which is in public
    response.send(cartfile);
  
  });
// REFERENCED FROM RICK KAZMAN, LAB 15 EXAMPLE 
// ALSO AIDED BY DANIEL PORT ON 12/14, OFFICE HOURS
app.get("/login", function (request, response) {
    // send the login.view
    error = {};
   error.password = ""; // creating error variable
   error.username = "";
    loginfile = fs.readFileSync('./login.view', 'utf-8'); // setting variable
    response.send(eval('`'+loginfile +'`'));
   });
   
// ALSO AIDED BY DANIEL PORT ON 12/14, OFFICE HOURS
   app.get("/logout", function (request, response) {
    // expire the cookie and send to home page
     response.clearCookie('username');
     response.redirect('./index.html');
    });

// REFERENCED FROM RICK KAZMAN, LAB 15
// Handle the login form information, including session the session variables for username and last_login
app.post("/process_login", function (request, response) {
    // First save the request and, in particular, the username and password
    POST = request.body;
    user_name_from_form = POST["username"].toLowerCase(); // makes it not case sensitive
    password_from_form = POST["password"];
    // console.log("User name from form=" + user_name_from_form);
    error = {};
  error.password = "";
  error.username = "";
    // Now check to see if the username and password match what is on file
    if (user_data[user_name_from_form] != undefined) {
        password_on_file = user_data[user_name_from_form].password;
        if (password_from_form == password_on_file) {
            // Good login
            request.session.username = user_name_from_form;
            if (typeof request.session.last_login != 'undefined') {
                var msg = `You last logged in at ${request.session.last_login}`;
                var now = new Date();
            } else {
                var msg = '';
                var now = 'first visit!';
            }
            request.session.last_login = now;
            // send the user a cookie with the username to show that they're logged in
            response.cookie('username', user_name_from_form); 
            // response.cookie('email', user_data[user_name_from_form].email);
            response.redirect('./index.html');
            return;
        // REFERENCED FROM DANIEL PORT, OFFICE HOURS APPOINTMENT 12/14
        } else { // oops password doesn't match
        error.password = 'Password does not match';
        }
    } else { // oops username doesnt exist
      error.username = 'Username does not exist';
    }
    // have an error, send them back to login
    loginfile = fs.readFileSync('./login.view', 'utf-8');
    response.send(eval('`'+loginfile +'`'));
  });
       
// AIDED BY DANIEL PORT ON 12/14, OFFICE HOURS
app.post("/generateInvoice", function (request, response) {
    console.log(user_data, 'Generate Invoice'); // creates the invoice page after user confirms cart
    var user_email = user_data[request.cookies.username].email; // setting variables
    var address = user_data[request.cookies.username].address;
    cart = JSON.parse(request.query['cartData']); // parsing cart

    str = // CREATES THE INVOICE STRING THAT WILL BE SHOWN WHEN THE USER SUBMITS AND ALSO IN THE EMAIL
    // REFERENCED FROM DANIEL PORT A3 EXAMPLES
    `<!doctype html>
    <html>
    <head>
    
        <meta charset="utf-8">
        <title>Invoice</title> <!--Tab title-->
        <!--Styling the invoice (CSS)-->
        <style> 
        .invoice-box { /*creating the box that surrounds the table*/
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
        }
        
        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left; /*formatting table*/
        }
        
        .invoice-box table td {
            padding: 10px;
            vertical-align: top;
        }
        
        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }
        
        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }
        
        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }
        
        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }
        
        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }
        
        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }
        
        .invoice-box table tr.item td{
            border-bottom: 1px solid #eee;
        }
        
        .invoice-box table tr.item.last td {
            border-bottom: none;
        }
        
        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }
        
        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }
            
            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }
        
        /** RTL **/
        .rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; 
        }
        
        .rtl table {
            text-align: right;
        }
        
        .rtl table tr td:nth-child(2) {
            text-align: left;
        }
        </style>
    </head>  
    <!-- Center header on page -->
    <div class="invoice-box"> <!--invoice box styling-->
    <table cellpadding="0" cellspacing="0">
        <tr class="top">
            <td colspan="2">
                <table>
                    <tr>
                        <td class="title"> <!--thank you gif above invoice-->
                            <img src="https://i.ibb.co/HhVjrGb/4f92fe4ee07e79bc3495e41bb5ae1bd3.gif" style="width:100%; max-width:300px;">
                        </td>
                        <td style="text-align: right;" width="50%">Invoice</div></td> <!--invoice title, upper righthand corner-->
                    </tr>
                </table>
            </td>
        </tr>
<!-- personalization, prints username, email and address-->
        <h3 align="center">Thank you for your purchase, <font color="#629DD1">${request.cookies.username}!</font><br />An email copy has been sent to <font color="#629DD1">${user_email}</font>
        <h3 align="center">Your order will be shipped to  <font color="#629DD1">${address}</font></h3>
        <h3 align="center"><form action="/logout">
        <input type="submit" value="Finish"/></h3> <!-- logs out user when they're done-->
    </form>
        <!-- template taken from first invoice on assignment1 -->
        <tr class="heading">
        <td>
        Products <!--Grey bar above invoice-->
        </td>
            <tbody>
                <table border="0">
                <th style="text-align: left;" width="43%">Earrings</th> 
                <th style="text-align: right;" width="11%">Quantity</th> 
                <th style="text-align: right;" width="13%">Price</th> <!--Invoice subtitles-->
                <th style="text-align: right;" width="54%">Extended Price</th>
                </tr> 
            </tbody>  
          <table>`;

            subtotal = 0; //subtotal starts off as 0
            for (product in products) {
                for (i = 0; i < products[product].length; i++) {

                    qty = cart[`${product}${i}`];
                    if (qty > 0) { //if a quantity is entered in the textbox 
                        extended_price = qty * products[product][i].price //equation for extended price
                        subtotal += extended_price; //adds each subtotatl to get the the extrended price 
                        // prints product data into invoice
                        str+=`
                        <tr>
                        <td width="43%">${products[product][i].name}</td>
                        <td align="center" width="11%">${qty}</td>
                        <td width="13%" align=right>\$${products[product][i].price}</td>
                        <td width="54%" align=right>\$${extended_price}</td>
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
                } // if total is less then or equal to $50, shipping is $2
             else if (subtotal <= 100) {
              shipping = 5;
            } // if total is less then or equal to $100 but more then 50, shipping is $5
             else {
              shipping = 0.05 * subtotal; //anything over 100, shipping is 5% of subtotal
              }
            // Compute grand total
              var total = subtotal + tax + shipping;
            // prints final totals
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
                

  // REFERENCED FROM DANIEL PORT DISPLAY_AND_MAIL_INVOICE_EXAMPLE
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu", // hosting on UH server so emails can be sent to hawaii.edu
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
    var mailOptions = {
        from: 'riannepitm352@gmail.com', //sends the invoice from my email. i made a burner email because i didn't want to use my personal one
        to: user_email, //sends the email to cookie from the account that was logged in
        subject: 'Invoice', // subject line telling customer what the email is about
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

//REFERENCED FROM ASSIGNMENT 1
app.post("/process_form", function (request, response) { 
    let POST = request.body; // data is in the body 

    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
        var validAmount = true; //make the variable validAmount true 
        var amount = false; //make the variable amount equal to false 

        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { // all products
            qty = POST[`quantity_textbox${i}`]; //creates variables

            if (qty > 0) {
                amount = true; // must be greater than 0 to be true
            }

            if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
                validAmount = false; // invalid data!
            }

        }

        const stringified = queryString.stringify(POST); //creates string

    }
});

//REFERENCED FROM DANIEL PORT, ASSIGNMENT 1
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative number</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full product</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}
app.get("/checkout", function (request, response) {
  var user_email = request.query.email; // email address in querystring
  var product = {};
// Generate HTML invoice string
  var invoice_str = `Thank you for your order ${user_email}!<table border><th>Quantity</th><th>Item</th>`;
  var shopping_cart = request.session.cart;
  for(product in products) {
    for(i=0; i<products[product][i].length; i++) {
        if(typeof shopping_cart[product] == 'undefined') continue;
        qty = shopping_cart[product][i];
        if(qty > 0) {
          invoice_str += `<tr><td>${qty}</td><td>${products[product][i].name}</td><tr>`;
        }
    }
}
  invoice_str += '</table>';
// Set up mail server. Only will work on UH Network due to security restrictions
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    secure: false, // use TLS
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: 'phoney_store@bogus.com',
    to: user_email,
    subject: 'Your phoney invoice',
    html: invoice_str
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      invoice_str += '<br>There was an error and your invoice could not be emailed :(';
    } else {
      invoice_str += `<br>Your invoice was mailed to ${user_email}`;
    }
    response.send(invoice_str);
  });
 
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

//REFERENCED FROM ASSIGNMENT 2 + ALYSSA MENCEL
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
    } else if (typeof user_data[registered_username] != "undefined") { //checks if username is taken
        errs.username = '<font color="red">Username Taken</font>'; //error if taken 
    } else {
        errs.username = null;
    }

    //name validation
    if (registered_name.length > 30) { //name has to be shorter than 30 
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    };
    // setting full name to allow no numbers
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.name) == false) {
       errs.name = '<font color="red">Only use letters and a space for full name</font>' // no numbers for full name, because who has numbers in their legal name anyways? 
    } else {
      errs.name = null;
    }

    //password validation
    if (request.body.password.length == 0) { //you must enter a password
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //password has to be 6 characters
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//repeat has to be the same as original
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; //error if not
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    // email validation
    if (request.body.email == '') { // you must enter an email address
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }
// REFERENCED FROM https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
    let result = !Object.values(errs).every(o => o === null); 
    console.log(result); // checks for null values 

    if (result == false) { // no errors? data is good to be added to user_data file
        user_data[registered_username] = {}; 
        user_data[registered_username].name = request.body.name; 
        user_data[registered_username].password = request.body.password; 
        user_data[registered_username].email = request.body.email; 
        user_data[registered_username].address = request.body.address;
        fs.writeFileSync(filename, JSON.stringify(user_data, null, 2)); // syncs file
        // creates cookies
        response.cookie("username", registered_username); 
        response.cookie("name", registered_name); 
        response.cookie("email", request.body.email); 
        response.cookie("address", request.body.address); 
        response.json({}); 
    } else {
        response.json(errs); 
    }

});

app.use(express.static('./public')); //public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); //port 8080