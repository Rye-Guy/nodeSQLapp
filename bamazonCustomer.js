var inquirer = require('inquirer');
var sql = require('mysql');

var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "racioppo99",
    database: "bamazon_schema"
});

connection.connect(function (err) {
    if (err) throw err;
    whatDoYouWant();
})

function whatDoYouWant() {
    inquirer.prompt([{

            name: 'userID',
            type: 'input',
            message: 'Please provide a product ID between (1 - 10)',
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like?',
        }
    ]).then(function (answer) {
        var itemID = answer.userID
        var amount = answer.quantity

        console.log(itemID);
        console.log(amount);

        var query = "SELECT item_id, product_name, stock_qantity "
        query += "FROM products "
        query += "WHERE item_id = " + itemID + " AND stock_qantity > " + amount + ";";
        // console.log(query);
        connection.query(query, function (err, response, feilds) {
            if (err) throw err;
            if (amount <= response[0].stock_qantity) {
                console.log("We have that in stock! Thank you for your purchase.");
                var updateQuery = "UPDATE products SET stock_qantity = " + (response[0].stock_qantity - amount) + " WHERE item_id = " + itemID;
                connection.query(updateQuery, function (err, response, feilds) {
                    if (err) throw err;
                    console.log("Your order was sucessful for" + answer.name + "your total is: $" + amount * answer);
                });
            } else {
                console.log("Sorry we are out of stock for that item...try less or wait for the manager to order more");
            }
            // console.log(response[0].stock_qantity);
            // console.log(response[0].product_name);
        })
    });
}

// connection.connect(function(err){
//     if(err){
//         console.log("failed to connect")
//     }else{
//         console.log(response)
//     }
// })