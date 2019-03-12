const express = require('express');
const router = express.Router();
const moment = require('moment');
const ingredient_t = require('../DB_models/Ingredients');

//Render page with data from database
//GET request to localhost:3000/users/login
router.get('/showall', function(req, res){
    //renders showall_recipes with all the available ingredients
    db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null', function(err, results) {
        for (key in results){
            results[key]['ingredient_expiration_date'] = moment(results[key]['ingredient_expiration_date']).format('LL');
        }
        if (err) throw err
        res.render('showall_ingredients',{
            title:"Your Ingredients",
            results: results
        });
    });
});

//Render page with data from database
//GET request to localhost:3000/users/login
router.get('/expired', function(req, res){
    //renders showall_recipes with all the available ingredients
    db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null AND ingredient_expiration_date < CURDATE() ', function(err, results) {
        for (key in results){
            results[key]['ingredient_expiration_date'] = moment(results[key]['ingredient_expiration_date']).format('LL');
        }
        if (err) throw err
        res.render('expired_ingredients_np',{
            title:"Your Ingredients",
            results: results
        });
    });
});

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
    const ing_ingredient_name = req.body.ingredient_name;
    const ing_ingredient_total = req.body.ingredient_total;
    const ing_ingredient_measurement = req.body.ingredient_measurement;
    const ing_ingredient_expiration_date = req.body.ingredient_expiration_date;
    //Do crazy stuff here
    result = "('"+ing_ingredient_name+"',"+ing_ingredient_total+",'"+ing_ingredient_measurement+"','"+ing_ingredient_expiration_date+"')";
    db.query('INSERT INTO ingredients (ingredient_name, ingredient_total, ingredient_measurement,ingredient_expiration_date) VALUES '+result, function(err, results) {
        if (err) throw err
        /******************************************/
        //Commented out these lines to temporarily
        //fix the header issue********************/
        /************************************** */
        //Render same page with newly added ingredient
        // res.render('add_ingredient',{
        //     title:'Add Ingredient'
        // });
    });

    res.redirect('/ingredients/showall');
})

//remove ingredient by id
router.delete('/remove/:id', function(req,res){
    const ingredient = req.params.id;
    const delete_query = "DELETE FROM ingredients WHERE ingredient_name ='"+ingredient+"'";
    db.query(delete_query, function(err, results) {
        if (err) throw err
        //Since AJAX under /js/main.js made a request we have to respond back
        res.send("Success");
    });

})

//remove ingredient by name
router.delete('/remove/recipe_ingredient/:name', function(req,res){
    const ingredient = req.params.name;
    console.log("REMOVING");
    console.log(ingredient);
    //Since no cascading is set up have to do it manually
    //delete ingredient from recipe_ingredient table
    const delete_query = "DELETE FROM recipe_ingredient WHERE recipe_ingredient_used ='"+ingredient+"'";
    db.query(delete_query, function(err){
        if (err) throw err
        //Since AJAX under /js/main.js made a request we have to respond back
    });
    console.log("DONE");
    res.send("Success");

})

module.exports = router;