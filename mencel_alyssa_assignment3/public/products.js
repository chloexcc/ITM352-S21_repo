/* Alyssa's Assignment 1 array of products */
var products_array = [
    {
    'type': "bath",
    'image': "./images/shampoo.jpg"
    },
    {
    'type': "home",
    'image': "./images/bag.jpg"
    },
    {
    'type': "kitchen",
    'image': "./images/lid.jpg"
    },
    {
    'type': "kit",
    'image': "./images/togo.jpg"
    },
    {
    'type': "extra",
    'image': "./images/tshirt.jpg"
    }

]
var bath = [
    //bath product 1
    {
    "name": "Shampoo & Conditioner Bars",
    "price": 13.00,
    "image": "./images/shampoo.jpg"
    },
    //bath product 2
    {
    "name": "Bamboo Tooth Brush",
    "price": 3.50,
    "image": "./images/toothbrush.jpg"
    },
    //bath product 3
    {
    "name": "Face Wash Bar",
    "price": 6.00,
    "image": "./images/facebar.jpg"
    },
    //bath product 4
    {
    "name": "Lip Gloss w/ Compostable Tube",
    "price": 9.00,
    "image": "./images/lipstick.jpg"
    },
    //bath product 5
    {
    "name": "Reef Safe Face Sunscreen",
    "price": 17.99,
    "image": "./images/sunscreen.jpg"
    }
]
var home = [
    //home product 1
    {
    "name": "Machine Washable Sponge",
    "price": 10.00,
    "image": "./images/sponge.jpg"
    },
    //home product 2
    {
    "name": "Mesh Tote",
    "price": 8.00,
    "image": "./images/bag.jpg"
    },
    //home product 3
    {
    "name": "Reusable Bamboo Utensils",
    "price": 15.99,
    "image": "./images/utensils.jpg"
    },
    //home product 4
    {
    "name": "Spray Bottle",
    "price": 14.00,
    "image": "./images/spray.jpg"
    },
    //home product 5
    {
    "name": "Squeezable Travel Tubes",
    "price": 8.99,
    "image": "./images/bottle.jpg"
    }
]
var kitchen = [
    //kitchen product 1
    {
    "name": "Mason Jar Straw Lid",
    "price": 5.99,
    "image": "./images/lid.jpg"
    },
    //kitchen product 2
    {
    "name": "Stasher Bag",
    "price": 9.99,
    "image": "./images/ziploc.jpg"
    },
    //kitchen product 3
    {
    "name": "Reusable Metal Straws",
    "price": 2.99,
    "image": "./images/straws.jpg"
    },
    //kitchen product 4
    {
    "name": "Bees Wax Wraps",
    "price": 20.00,
    "image": "./images/wraps.jpg"
    },
    //kitchen product 5
    {
    "name": "Coconut Bowl",
    "price": 8.00,
    "image": "./images/bowl.jpg"
    }
]
var kits = [
    //kits product 1
    {
    "name": "Kitchen & Home Kit",
    "price": 81.99,
    "image": "./images/homekit.jpg"
    },
    //kits product 2
    {
    "name": "Mini Starter Kit",
    "price": 52.00,
    "image": "./images/mini.jpg"
    },
    //kits product 3
    {
    "name": "Starter Kit",
    "price": 99.99,
    "image": "./images/starter.jpg"
    },
    //kits product 4
    {
    "name": "To-Go Kit",
    "price": 14.00,
    "image": "./images/togo.jpg"
    },
    //kits product 5
    {
    "name": "Bathroom Kit",
    "price": 47.50,
    "image": "./images/bathroom.jpg"
    }
]
var extra = [
    //extra product 1
    {
    "name": "Tshirt- 100% Recycable",
    "price": 35.00,
    "image": "./images/tshirt.jpg"
    },
    //extra product 2
    {
    "name": "Compostable Airpod's Case",
    "price": 24.95,
    "image": "./images/airpod.jpg"
    },
    //extra product 3
    {
    "name": "Compostable Card Holder",
    "price": 19.95,
    "image": "./images/card.jpg"
    },
    //extra product 4
    {
    "name": "Compostable Phone Case",
    "price": 49.95,
    "image": "./images/phone.jpg"
    },
    //extra product 5
    {
    "name": "To-Go Snack Set",
    "price": 5.99,
    "image": "./images/snack.jpg"
    }
]
var allProducts = {
    "bath": bath,
    "home": home,
    "kitchen": kitchen,
    "kits": kits, 
    "extra": extra
}
if (typeof module != 'undefined') {
    module.exports.allProducts = allProducts;
  }