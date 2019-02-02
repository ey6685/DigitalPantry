const express = require('express');
const router = express.Router();


/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/showall
DESCRIPTION: This will display all available recipes that are pulled from database
*/
router.get('/showall', function(req, res){
    db.query('SELECT * FROM recipes', function(err, results) {
        if (err) throw err
        res.render('showall_recipes',{
            title: "Your Recipes",
            results: results
        })
      })
})


/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/add
DESCRIPTION: This will render add recipe page with a form
*/
router.get('/add', function(req, res){
    res.render('add_recipe',{
        title:"Add New Recipe"
    });
})


/*
TYPE: POST
URL ENDPOINT: localhost:3000/recipes/add
DESCRIPTION: This will send a request with data of new recipe and its ingredients
BODY_PARAMS:
    recipe_name
    recipe_serving_size
    ingredients - Array
        ingredient_name
        ingredient_size
        ingredient_quantity
        ingredient_size
        ingredient_expiration_date
*/
router.post('/add', function(req, res){
    //recipe_name and recipe_size are unique form fields, so they do not require any recursion to grab all of them
    const recipeName = req.body.recipeName;
    const recipeServingSize = req.body.recipeServingSize

    //***************************
    //TODO add pantry ID here
    //***************************

    //Create entire query value
    var query = "('" + recipeName + "','" + recipeServingSize + "')";
    console.log("Recipe Name: " + recipeName);
    console.log("Recipe Serving Size: " + recipeServingSize);
    console.log("Insert into Recipe Query: " + query);
    //Insert Recipe name and size into a table first
    // db.query('insert into recipe (name) values ('+'"'+req.body.recipe_name+'"'+')', function(err, results) {
    db.query('insert into recipes (recipe_name,recipe_serving_size) values ' + query, function(err, results) {
        if (err) throw err
        console.log("Recipe added sucessfully");
        console.log("results after adding a recipe: "+results);
        //Get id of the inserted row, this works because of auto increment set in the table
        recipe_id_inserted = results.insertId;

        //Iterate over every key_name inside JSON request
        for(var key in req.body) {
            //When Ingredient key_name is found
            //For every ingredient in recipe defined by user in the form do the following
            if(key.includes("ingredientProperties")){
                //Retrieve all values from request body
                const ingredientName = req.body[key][0];
                const ingredietQuantity = req.body[key][1];
                const ingredientMeasurement = req.body[key][2];

                //***************************
                //TODO CHANGE THIS TO PASSED IN VALUE FROM THE FORM
                const ingredientExpirationDate = "2000-10-10";
                //***************************

                query = "('"+ingredientName+"',"+ingredietQuantity+",'"+ingredientMeasurement+"','" + ingredientExpirationDate + "')";
                console.log("Ingredient Name: " + ingredientName);
                console.log("Ingredient Qty: " + ingredietQuantity);
                console.log("Ingredient Measurement: " + ingredientMeasurement);
                console.log("Insert into ingredients query: " + query);
                //Insert ingredient into a Ingredients table
                db.query('insert into ingredients (ingredient_name,ingredient_total,ingredient_measurement,ingredient_expiration_date) values '+query, function(err, results) {
                    if (err) throw err
                    //Get inserted ingredient's row id, this works because auto-increment is set in the table
                    ingredients_ids_inserted = results.insertId;
                    //Create values that will be inserted into recipe_ingredient table
                    //recipe_ingredients is what links ingredients to the recipe
                    values = recipe_id_inserted + ',' + ingredients_ids_inserted
                    // query = "("+ingredients_ids_inserted + "," + ingredietQuantity + "," + recipe_id_inserted + ",'" + ingredientMeasurement + "')";
                    query = "("+ingredients_ids_inserted + "," + recipe_id_inserted + "," + ingredietQuantity + ",'" + ingredientMeasurement + "')";

                    //***************************
                    //TODO add pantry ID here
                    //***************************

                    db.query('insert into recipe_ingredient (ingredient_id,recipe_id,recipe_ingredient_qty,recipe_ingredient_measurement) values ' + query, function(err, results) {
                        if (err) throw err
                    });

                });
            }
        //Repeat until all recipes have been parsed
        }
    });

    // res.send(req.body.ingredientName[1]);
    //This will respond with the parameters that you sent in your request
    //TODO redirect to another page
    res.redirect("showall");
})


/*
TYPE: DELETE
URL ENDPOINT: localhost:3000/recipes/remove/${id}
DESCRIPTION: This will delete a recipe from database based on its id
COMMENTS: This block gets executed by AJAX script located under public/js/main.js
URL_PARAMS:
    id
*/
//DELETE request to localhost:3000/recipes/remove
//this will delete recipe from database based on its ID

//CURRENT BEHAVIOR
//This will delete recipe from recipe table and from recipe ingredient table
//HOWEVER it will not delete ingredient inside that recipe from ignredients table

router.delete('/remove/:id', function(req, res){
    const recipe = req.params.id;
    const delete_query = "DELETE FROM recipes WHERE recipe_id ='"+recipe+"'";
    db.query(delete_query, function(err, results) {
        if (err) throw err
        //Since AJAX under /js/main.js made a request we have to respond back
        res.send("Success");
    });
})

module.exports = router;