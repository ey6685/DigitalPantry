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
    //TODO uncomment bellow once add_recipe.pug has been added
    // res.render('add_recipe.pug',{
    //     title:"Add New Recipe"
    // });
    res.send('RENDER ADD RECIPE PAGE WITH FORM HERE');
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
    console.log("Recipe Name: " + req.body.recipe_name);
    console.log("Recipe Size: " + req.body.recipe_size);
    //Insert Recipe name and size into a table first
    db.query('insert into recipe (name) values ('+'"'+req.body.recipe_name+'"'+')', function(err, results) {
        if (err) throw err
        //Render same page with newly added ingredient
        console.log("Recipe added sucessfully");
        console.log("results after adding a recipe: "+results);
        //Get id of the inserted row, this works because of auto increment set in the table
        recipe_id_inserted = results.insertId;

        //Iterate over evry key_name inside JSON
        for(var key in req.body) {
            //When Ingredient key_name is found
            //For every ingredient in recipe defined by user in the form do the following
            if(key.includes("ingredient")){
                //Insert ingredient into a Ingredients table
                db.query('insert into ingredients (name) values ('+'"'+req.body[key][0]+'"'+')', function(err, results) {
                    if (err) throw err
                    //Get inserted ingredient's row id, this works because auto-increment is set in the table
                    ingredients_ids_inserted = results.insertId;
                    console.log("Ingredient ID: " + ingredients_ids_inserted);
                    //Create values that will be inserted into recipe_ingredients table
                    //recipe_ingredients is what links ingredients to the recipe
                    values = recipe_id_inserted + ',' + ingredients_ids_inserted
                    db.query('insert into recipe_ingredients (recipe_id,ingredient_id) values (' + values + ')', function(err, results) {
                        if (err) throw err
                    });

                });
                console.log("RECIPE ID: " + recipe_id_inserted);
            }
        //Repeat until all recipes have been parsed
        }
    });

    // res.send(req.body.ingredientName[1]);
    //This will respond with the parameters that you sent in your request
    //TODO redirect to another page
    res.send(req.body);
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
//This will display all available recipes
router.delete('/remove/:id', function(req, res){
    //TODO logic to delete recipe from database
    const recipe = req.params.id;
    const delete_query = "DELETE FROM recipes WHERE recipeID ='"+recipe+"'";
    db.query(delete_query, function(err, results) {
        if (err) throw err
        //Since AJAX under /js/main.js made a request we have to respond back
        res.send("Success");
    });
})

module.exports = router;