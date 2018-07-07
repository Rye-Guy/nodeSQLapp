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
    showMeTheStuff();


function showMeTheStuff() {
    inquirer.prompt({
        name: 'managerSelection',
        type: 'list',
        message: 'Hola, Jefe. What would you like?',
        choices: [{
                value: 'option1',
                name: "View Products For Sale"
            },
            {
                value: 'option2',
                name: "View Low Inventory"
            },
            {
                value: 'option3',
                name: "Add to Inventory"
            },
            {
                value: 'option4',
                name: "Add New Product"
            }
        ]

    }).then(function (managerSelection) {
            choice = JSON.stringify(managerSelection);
            switch (choice) {
                case '{"managerSelection":"option1"}':
        
                    var query = "SELECT * FROM products;";
                    connection.query(query, function (err, response, feilds) {
                        if (err) throw err;
                        for (i = 0; i < response.length; i++) {
                            console.log("#### | " + "Item ID: " + response[i].item_id + " | " + "Name: " + response[i].product_name + " | " + " Price: $" + response[i].price + " | " + " Stock: " + response[i].stock_quantity + " | #####");
                        }
                        inquirer.prompt({
                            name: "nextStep",
                            type: 'confirm',
                            message: 'Would you like to do anything else?',

                        }).then(function (answer) {
                            choice = JSON.stringify(answer);
                            if (choice == '{"nextStep":false}') {
                                console.log('Goodbye!...Connection Terminated');
                                connection.end();
                            } else
                                showMeTheStuff();
                        })
                    })
                    break;

                case '{"managerSelection":"option2"}':
                    query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity <= 5"
                    connection.query(query, function (err, response) {
                        if (err) throw err;
                        for (i = 0; i < response.length; i++) {
                            console.log("#### | " + "Item ID: " + response[i].item_id + " | " + "Name: " + response[i].product_name + " Stock: " + response[i].stock_quantity + " | #####");
                        }
                        inquirer.prompt({
                            name: "nextStep",
                            type: 'confirm',
                            message: 'Would you like to place an order today?',

                        }).then(function (answer) {
                            choice = JSON.stringify(answer);
                            if (choice == '{"nextStep":false}') {
                                console.log('Goodbye!...Connection Terminated');
                                connection.end();
                            } else
                                placeOrder();
                            //showMeTheStuff();
                        })
                    });
                    break;

                case '{"managerSelection":"option3"}':
                    placeOrder();
                    function placeOrder() {
                        query = "SELECT item_id, product_name, stock_quantity FROM products"
                        connection.query(query, function (err, response) {
                                if (err) throw err;
                                for (i = 0; i < response.length; i++) {
                                    console.log("#### | " + "Item ID: " + response[i].item_id + " | " + "Name: " + response[i].product_name + " | Stock: " + response[i].stock_quantity + " | #####");
                                }
                                inquirer.prompt([{

                                    name: 'itemID',
                                    type: 'input',
                                    message: 'Please provide a product ID for your order.'
                                },
                                {
                                    name: 'quantity',
                                    type: 'input',
                                    message: 'How many would you like?'
                                }
                            ]).then(function (answer) {
                                productID = answer.itemID
                                orderAmount = answer.quantity
                                updateQuery = "UPDATE products SET stock_quantity = stock_quantity + " + orderAmount + " WHERE item_id = " + productID;
                                connection.query(updateQuery, function (err, response){
                                    if(err) throw err;
                                    console.log("Order Completed!")

                                    inquirer.prompt({
                                        name: "nextStep",
                                        type: 'confirm',
                                        message: 'Would you like to place an order today?',
            
                                    }).then(function (answer) {
                                        choice = JSON.stringify(answer);
                                        if (choice == '{"nextStep":false}') {
                                            console.log('Goodbye!...Connection Terminated');
                                            connection.end();
                                        } else
                                            placeOrder();
                                        //showMeTheStuff();
                                    })
                                });
                                

                                });
                            });
                        }
                        break;
           
                        case '{"managerSelection":"option4"}':
                        newProduct();

                         function newProduct(){
                            inquirer.prompt([{

                                name: 'productName',
                                type: 'input',
                                message: 'Please Provide a Product Name'
                            },
                            {
                                name: 'department',
                                type: 'list',
                                message: 'What Department Does It Belong In?',
                                choices: [{
                                    value: 'Mystical Items',
                                    name: "Mystical Items"
                                },
                                {
                                    value: 'Mythological Items',
                                    name: "Mythological Items"
                                }
                            ]
                            },
                            {
                                name: 'productPrice',
                                type: 'input',
                                message: 'The Price of The Item?'
                            },
                            {
                                name: 'stockNum',
                                type: 'input',
                                message: 'How much are you stocking?'
                            }
                        ]).then(function (answers) {
                          
                            updateQuery = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (" + "'" + answers.productName + "'" + ", " +  "'" + answers.department + "'" + ", " + answers.productPrice  + ", " + answers.stockNum + ");";

                            console.log(updateQuery);
                            
                            connection.query(updateQuery, function(err, response){
                               // if(err) throw err;
                                console.log("You have made an order successfully");

                            })
                            // INSERT INTO products (product_name, department_name, price, stock_quantity)
                            // VALUES (var1, var2, numVar1, numVar2)
                        });
                            
                        
                    }
                    break;

                    }
                    // if(choice == '{"managerSelection":"option1"}'){

                    // }else
                    // console.log("Dude");
            })
    }

});