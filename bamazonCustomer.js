
// my notes: in command line run: nodemon bamazonCustomer.js 
// running this application will first display all of the items available for sale. 
// Include the ids, names, prices, etc. of products for sale 

// The app should then prompt users with two messages: 
// 1.   The first should ask them the ID of the product they would like to buy. 
// 2.   The second message should ask how many units of the product they would like to buy. 
// 3.   Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// 4.   If not, the app should log a phrase like "Insufficient quantity!" and then prevent the order from going through.
// 5.   However, if your store does have enough of the product, you should fulfill the customer's order.

// 6.   This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

//console.log(process.env);

var item = process.argv[2];
var units = process.argv[3];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.PASSWORD,
  database: "bamazon_db"
});


connection.connect(function(err) {
  if (err) {
      throw err;
  } else {
      console.log("connected as id " + connection.threadId + "\n");
      readProducts();
      //showProducts();
  }
});

function showProducts() { 

inquirer.prompt([{
    type: "list",
    name: "action",
    message: "pick one: ",
    choices: ["MAKE A PURCHASE"]
}
]).then(function(data) {  
  if(data.action == "MAKE A PURCHASE") {
    connection.query("SELECT products.item_id AS item, products.product_name AS name, products.department_name AS dept, products.price AS price, products.stock_quantity AS quantity FROM products", function(err, show) {
      console.log(show);
      makeSelection();    
      });
    }
});
}

function makeSelection() {

  inquirer.prompt([
    {
      type: "input",
      name: "product_id",
      message: "Input a product id that you would like to buy? : ",
    },
    {
      type: "input",
      name: "name",
      message: "What is this item? : ",
    },
    {
      type: "input",
      name: "units",
      message: "How many units of the product would you like to buy? : ",
    },
    {
      type: "input",
      name: "max_quantity",
      message: "What is the current quantity? " ,
    },
    {
      type: "input",
      name: "guest",
      message: "Give me your name: "
    }
  ]) // add a console log of the item customer wants to purchase as well as quantity 
.then(function(inquirerResponse) {
  console.log(inquirerResponse);
  console.log("\nI understand you want to buy a/an, " + inquirerResponse.name + ", which is product id # " + inquirerResponse.product_id);
  console.log("\nThe quantity you would like is "+ inquirerResponse.units + ", please wait a moment " + inquirerResponse.guest + " while I check if the item is in stock.\n"); 
  
  var max = 0; // we set the max to 0, I will use max to determine the quantity of stock

  if (inquirerResponse.units <= inquirerResponse.max_quantity) { // if units the User wants is less than or equal to the current quantity then continue,

    max = inquirerResponse.quantity; // here I set max to the current quantity in stock, for example 100

    console.log("we have your item in stock!\n"); // since the amount the User wants to buy is in stock we console log this output to confirm
    
  } else {
    console.log("Insufficient quantity."); // if the units is greater than the max_quantity in stock we console log this to the User
  }
  connection.end();
});

// logs the actual query being run and we update the database
console.log(query.sql);
}

function deleteProduct() {
console.log("Updating the current quantity.\n" );

}

function showCustomer() {

}

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);

    showProducts();
  });
}