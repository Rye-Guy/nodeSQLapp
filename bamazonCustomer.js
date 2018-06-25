var inquirer = require('inquirer');
var sql = require('mysql');

var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "racioppo99",
    database: "bamazon_schema"
});

var userID; 


connection.connect(function(err){
    if (err) throw err;
    whatDoYouWant();
})

function whatDoYouWant(){
    inquirer.prompt({

        name: 'userID',
        type: 'input',
        message: 'Please provide a product ID between (1 - 10)'
    
        
    }).then(function(answer){
        console.log(answer);
        var query = "SELECT item_id, product_name, stock_quantity "
        query += "FROM products "
        query += "WHERE item_id LIKE = " + parseFloat(answer.userID);
        console.log(query);
        connection.query(query, function(err, response){
            console.log(response);
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