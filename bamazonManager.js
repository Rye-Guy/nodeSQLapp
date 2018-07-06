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
});

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
                console.log('Sweet');
                var query = "SELECT * FROM products;";
                connection.query(query, function (err, response, feilds) {
                    if (err) throw err;
                    for (i = 0; i < response.length; i++) {
                        console.log("#### " + "Item ID: " + response[i].item_id + " | " + "Name: " + response[i].product_name + " | " + " Price: $" + response[i].price + " | " + " Stock: " + response[i].stock_quantity + " #####");
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
                connection.query(query, function(err, response){
                    if(err) throw err; 
                    console.log(response);
                    for(i = 0; i < response.length; i++){
                        console.log();
                    }
                });
                console.log('Sweet');
                break;

            case '{"managerSelection":"option3"}':
                console.log('Sweet');
                break;

            case '{"managerSelection":"option5"}':
                console.log('Sweet');
                break;

            default:
                console.log('Dude');
                break;
        }
        // if(choice == '{"managerSelection":"option1"}'){

        // }else
        // console.log("Dude");
    })
}