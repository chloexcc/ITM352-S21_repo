var express = require('express'); // loads in the request 
var app = express();
var myParser = require("body-parser");  //take request, and read through the body
app.use(myParser.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {  //when get any function listen on 808 *means anything
    console.log(request.method + ' to path ' + request.path 
    + 'with query' +JSON.stringify(request.query));
    next();
});

app.get('/test。html', function (request,response,next){
    response.send('I got a request for /test');
});



app.post('./display_purchase', function (request,response,next) {
    user_data = {'username':'itm352', 'password':'grader'};
    post_data = request.body; 
    if(post_data['quantity_textbox']){
        the_qty = post_data['quantity_textbox'];
        if(isNonNegInt(the_qty)){
            response.send(`Thanks for purchasing ${the_qty} items!`);
            returns;
        } else{
            response.redirect('./order_page.html?quantity_textbox='+the_qty)
            returns;
        }

    }
    response.send(post_data);
}); //set up static page, respond to particular GET path


app.use(express.static('./public'));

app.listen(8080,function () {
    console.log(`listening on port 8080`)
}

); // note the use of an anonymous function here