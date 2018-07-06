var inquirer = require('inquirer');
var sql = require('mysql');

var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "somepassword",
    database: "products"
});

connection.connect(function (err) {
    if (err) throw err;
    whatDoYouWant();


function whatDoYouWant() {
    inquirer.prompt([{

            name: 'userID',
            type: 'input',
            message: 'Please provide a product ID between (1 - 10)'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like?'
        }
    ]).then(function (answer) {
        var itemID = answer.userID
        var amount = answer.quantity

        console.log(itemID);
        console.log(amount);

        var query = "SELECT *"
        query += "FROM products "
        query += "WHERE item_id = " + itemID + " AND stock_quantity > " + amount + ";";

        // console.log(query);
        connection.query(query, function (err, response, feilds) {
            console.log(response);
            //if (err) throw err;
            if (amount <= response[0].stock_quantity) {
                console.log("We have that in stock! Thank you for your purchase.");
                var updateQuery = "UPDATE products SET stock_quantity = " + (response[0].stock_quantity - amount) + " WHERE item_id = " + itemID + ";";
                connection.query(updateQuery, function (err, response) {
                    // if (err) throw err;
                    console.log(updateQuery);
                    console.log(response);
                    console.log("Your order was sucessful for " + response[0].product_name + " your total is: $" + amount * response[0].price);
                    
                });
            } else{
                console.log("Insufficient quantity!");
            }
            // console.log(response[0].stock_quantity);
            // console.log(response[0].product_name);
        })
        connection.end();
   });
} 

});
// connection.connect(function(err){
//     if(err){
//         console.log("failed to connect")
//     }else{

//         console.log(response)
//     }
// })