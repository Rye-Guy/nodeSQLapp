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
})

function whatDoYouWant() {
    query = "SELECT * FROM products;"
    connection.query(query, function(err, response){
        if (err) throw err;
                        console.log("---------Inventory---------");
                        for (i = 0; i < response.length; i++) {
                            console.log("#### | " + "Item ID: " + response[i].item_id + " | " + "Name: " + response[i].product_name + " | " + " Price: $" + response[i].price + " | " + " Stock: " + response[i].stock_quantity + " | ####");
                        }
                        console.log("---------Inventory---------");
    })
    inquirer.prompt([{

            name: 'userID',
            type: 'input',
            message: 'Please provide a valid item id.'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like?'
        }
    ]).then(function (answer) {
        var itemID = answer.userID
        var amount = answer.quantity

        var query = "SELECT * FROM products "
        query += "WHERE item_id = " + itemID + " AND stock_quantity > " + amount + ";";

        // console.log(query);
        connection.query(query, function (err, response, feilds) {
            
            //if (err) throw err;
            if (amount <= response[0].stock_quantity) {
                console.log("We have that in stock! Thank you for your purchase.");
                var updateQuery = "UPDATE products SET stock_quantity = " + (response[0].stock_quantity - amount) + " WHERE item_id = " + itemID;
                connection.query(updateQuery, function (err, data, feilds) {
                    // if (err) throw err;
            
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

// connection.connect(function(err){
//     if(err){
//         console.log("failed to connect")
//     }else{

//         console.log(response)
//     }
// })