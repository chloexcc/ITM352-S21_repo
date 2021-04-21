var express = require('express');  
var app = express();
var myParser = require("body-parser");  
app.use(myParser.urlencoded({ extended: true }));
var qs = require ('qs');

var products = require ('./product_data.json');

app.all('*', function (request, response, next) { 
    console.log(request.method + ' to path ' + request.path 
    + 'with query' + JSON.stringify(request.query));
    next();
});

app.get("/product_data.js", function (request,response,next){
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

app.get('/test。html', function (request,response,next){
    response.send('I got a request for /test');
});

//This processed the form order_page,html
app.post('./display_purchase', function (request,response,next) {
    process_quantity_form (request.body, request, response);
});