const express = require('express');
const router = express.Router();
const moment = require('moment');
const ingredient_t = require('../DB_models/Ingredients');
const ing_in_stock = require('../DB_models/ingredients_in_pantry');

//Render page with data from database
//GET request to localhost:3000/users/login
router.get('/showall', function(req, res){
    //renders showall_recipes with all the available ingredients

    ////////////////////////////////
    //need to add pantry id feching//
    /////////////////////////////////
    db.query('select ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id;', function(err, results) {
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

//Render page with a form for adding a new ingredient
//GET request to localhost:3000/ingredients/add
router.get('/add', function(req, res){
    res.render('add_ingredient',{
        title:'Add Ingredient'
    });
})

//POST request to localhost:3000/ingredients/add
//This will add a new ingredient to available ingredients and update database
router.post('/add', async function(req,res){
    //get parameters from request body
    const ing_ingredient_name = req.body.ingredient_name;
    const ing_ingredient_total = req.body.ingredient_total;
    const ing_ingredient_measurement = req.body.ingredient_measurement;
    const ing_ingredient_expiration_date = req.body.ingredient_expiration_date;
    var   new_ing_id;
    var  new_ingredient;
    //Do crazy stuff here

        //first make sure the ingredient has not been stored in the ingredient table.
        var does_ingred_exist = await ingredient_t.findAll({
            where:{
                ingredient_name: ing_ingredient_name
            }
        });
        //check the lenght of does ingred exist. if there is an ingredietn than we just need to get its 
        //ingredient id
        console.log("\n\noutput from checking if the ingredient exist" + JSON.stringify(does_ingred_exist));
        if(does_ingred_exist.length >= 1)
        {
            new_ing_id = does_ingred_exist[0].ingredient_id;
        }
        else
        {
            //add wieght asigning function call here
            new_ingredient = await ingredient_t.create({
                ingredient_name: ing_ingredient_name,
                //ingredient_weight: new_weight
            });
            new_ing_id = new_ingredient.ingredient_id;
        }

        ing_in_stock.create({
            ingredient_id: new_ing_id,
            //pantry_id : pantry_id,
            ingredient_amount: ing_ingredient_total,
            ingredient_unit_of_measurement : ing_ingredient_measurement,
            ingredient_expiration_date : ing_ingredient_expiration_date
        })
        .then(res =>{
            console.log("result of creation of new ingredient: " + res);
        })
    // });

    res.redirect('/ingredients/showall');
})

//remove ingredient by id
router.delete('/remove/:id/:ex', function(req,res){
    const ingredient = req.params.id;
    const ex_date = req.params.ex;
    const delete_query = "DELETE FROM ingredients WHERE ingredient_id ='"+ingredient+"' and ingredient_expiration_date= '" + ex_date +"';";
    // db.query(delete_query, function(err, results) {
    //     if (err) throw err
    //     //Since AJAX under /js/main.js made a request we have to respond back
    //     res.send("Success");
    // });
    console.log("\ningredient: " + ingredient + "\ndelete: " + delete_query);

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