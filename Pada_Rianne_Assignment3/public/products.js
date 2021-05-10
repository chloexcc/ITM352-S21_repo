// Rianne Pada products data// 
var all = [

   {
      //Product 1
  "name": "Appa",
  "price": 4.00,
  "image": "/images/appa.png"
  
  },
 
   {
      //Product 2
  "name": "Bold and Brash",
  "price": 5.00,
  "image": "/images/boldandbrash.png"
  
  },
        //Product 3
      {  "name": "Black Parade",
        "price": 4.00,
        "image": "images/blackparade.png"
        
        },
   //Product 4
   {
   "name": "Poison Apples",
   "price": 10.00,
   "image": "./images/poisonapple.png"
   },
   //Product 5
   {
      "name": "Sun and Moon Tarot",
      "price": 4.00,
      "image": "./images/tarot.png"
  },
   //Product 6
   {
      "name": "Milk",
      "price": 4.00,
      "image": "./images/milk.png"
      },  
   //Product 7
   {
   "name": "Stars",
   "price": 4.00,
   "image": "./images/stars.png"
   },
   //Product 8
   {
   "name": "Strawberries",
   "price": 5.00,
   "image": "./images/strawberries.png"
   },
   //Product 9
   {
      "name": "Isabelle",
      "price": 4.00,
      "image": "./images/isabelle.png"
      },
   //Product 10
   {
      "name": "Tom Nook",
      "price": 5.00,
      "image": "./images/tomnook.png"
      },  
   //Product 11
   {
   "name": "Master Swords",
   "price": 10.00,
   "image": "./images/swords.png"
   },
   //Product 12
   {
      "name": "Candy Corn",
      "price": 4.00,
      "image": "./images/candycorn.png" 
      },
   //Product 13
   {
      "name": "Pumpkin",
      "price": 5.00,
      "image": "./images/pumpkin.png" 
      },
   //Product 14
   {
      "name": "Ghosts",
      "price": 6.00,
      "image": "./images/ghosts.png" 
      },
   //Product 15
   {
      "name": "Christmas Trees",
      "price": 6.00,
      "image": "./images/xmastrees.png" 
      },
   //Product 16
   {
      "name": "Easter Bunnies",
      "price": 4.00,
      "image": "./images/easterbunny.png" 
      } 
]
var tvmovie = [
   {
      //Product 1
  "name": "Appa",
  "price": 4.00,
  "image": "/images/appa.png"
  },
   {
      //Product 2
  "name": "Bold and Brash",
  "price": 5.00,
  "image": "/images/boldandbrash.png"
  },
   //Product 3
      {  "name": "Black Parade",
        "price": 4.00,
        "image": "images/blackparade.png"
        
        },
   //Product 4
   {
   "name": "Snow White Poison Apples",
   "price": 10.00,
   "image": "./images/poisonapple.png"
   }
]
var videogame = [
   //Product 1
   {
      "name": "Isabelle (Animal Crossing)",
      "price": 4.00,
      "image": "./images/isabelle.png"
      },
   //Product 2
   {
      "name": "Tom Nook (Animal Crossing)",
      "price": 5.00,
      "image": "./images/tomnook.png"
      },  
   //Product 3
   {
   "name": "Master Swords (The Legend of Zelda)",
   "price": 10.00,
   "image": "./images/swords.png"
   }
]
var holiday = [
   //Product 1
   {
      "name": "Candy Corn",
      "price": 4.00,
      "image": "./images/candycorn.png" 
      },
   //Product 2
   {
      "name": "Pumpkin",
      "price": 5.00,
      "image": "./images/pumpkin.png" 
      },
   //Product 3
   {
      "name": "Ghosts",
      "price": 6.00,
      "image": "./images/ghosts.png" 
      },
   //Product 4
   {
      "name": "Christmas Trees",
      "price": 6.00,
      "image": "./images/xmastrees.png" 
      },
   //Product 5
   {
      "name": "Easter Bunnies",
      "price": 4.00,
      "image": "./images/easterbunny.png" 
      } 
]
var objectfood = [
   //Product 1
   {
      "name": "Sun and Moon Tarot",
      "price": 4.00,
      "image": "./images/tarot.png"
  },
   //Product 2
   {
      "name": "Milk",
      "price": 4.00,
      "image": "./images/milk.png"
      },  
   //Product 3
   {
   "name": "Stars",
   "price": 4.00,
   "image": "./images/stars.png"
   },
   //Product 4
   {
   "name": "Strawberries",
   "price": 5.00,
   "image": "./images/strawberries.png"
   }
]
var products = { // creates all products array
   "all": all, 
   "tvmovie": tvmovie,
   "videogame": videogame,
   "holiday": holiday, 
   "objectfood": objectfood
}
if (typeof module != 'undefined') {
   module.exports.products = products; // export the products
 }