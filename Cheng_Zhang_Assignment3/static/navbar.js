// Chloe and Caixin's navbar.js
//Add navigation bar on index, product, login, register, shopping cart page. Enable link to each pages

function navbar(){ 
    document.write(`
    <ul>
    <li><a href="./index.html">Home</a></li>
    <li><a href="./products_display.html${location.search}">Products</a></li>
    <li><a href="./login.html${location.search}">Login</a></li>
    <li><a href="./register.html${location.search}">Register</a></li>
    <li><a href="./shoppingchart.html${location.search}">Shopping Cart</a></li>
    <li style="float:right"><a class="active" href="./index.html${location.search}">Logout</a></li>
  </ul>
    `);
}