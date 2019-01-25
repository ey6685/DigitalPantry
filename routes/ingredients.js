const express = require('express');
const router = express.Router();

//Render page with data from database
//GET request to localhost:3000/users/login
router.get('/showall', function(req, res){
    //renders showall_recipes with all the available ingredients
    db.query('SELECT * FROM ingredients', function(err, results) {
        if (err) throw err
        res.render('showall_ingredients',{
            title:"Your Ingredients",
            results: results
        });
    })
})

//Render page with a form for adding a new ingredient
//GET request to localhost:3000/ingredients/add
router.get('/add', function(req, res){
    res.render('add_ingredient',{
        title:'Add Ingredient'
    });
})

//POST request to localhost:3000/ingredients/add
//This will add a new ingredient to available ingredients and update database
router.post('/add', function(req,res){
    //get parameters from request body
    const ing_name = req.body.name;
    const ing_measurement = req.body.quantity;
    const ing_serving_size = req.body.size;
    const ing_expiration = req.body.expirationDate;
    //Do crazy stuff here
    result = "'"+ing_name+"',"+ing_measurement+",'"+ing_expiration+"',"+ing_serving_size;
    db.query('INSERT INTO ingredients (ingredientName, size, expirationDate,qty) VALUES ('+result+')', function(err, results) {
        if (err) throw err
        //Render same page with newly added ingredient
        res.render('add_ingredient',{
            title:'Add Ingredient'
        });
    });

    res.redirect('/ingredients/showall');
})

router.delete('/remove/:id', function(req,res){
    const ingredient = req.params.id;
    const delete_query = "DELETE FROM ingredients WHERE ingredientName ='"+ingredient+"'";
    db.query(delete_query, function(err, results) {
        if (err) throw err
        //Since AJAX under /js/main.js made a request we have to respond back
        res.send("Success");
    });

})

module.exports = router;