const express = require('express');
const router = express.Router();

//GET request to localhost:3000/recipes/showall
//This will display all available recipes
router.get('/showall', function(req, res){
    db.query('SELECT * FROM recipes', function(err, results) {
        if (err) throw err
        res.render('showall_recipes',{
            title: "Your Recipes",
            results: results
        })
      })
})

//GET request to localhost:3000/recipes/add
//This will display all available recipes
router.get('/add', function(req, res){
    //renders a page with an ability to add a recipe to the database
    //TODO uncomment bellow once add_recipe.pug has been added
    // res.render('add_recipe.pug',{
    //     title:"Add New Recipe"
    // });
    res.send('RENDER ADD RECIPE PAGE WITH FORM HERE');
})

//PUT request to localhost:3000/recipes/add
//This will send a request with data of new recipe to the database
router.post('/add', function(req, res){
    //Get all data from POST body request
    // const rec_id = req.body.recipe_id;
    // const pantry_id = req.body.pantry_id;
    // const rec_name = req.body.recipe_name;
    // const serv_size = req.body.serving_size;
    // const ingredients_needed = req.body.ingredients;
    //combine all variables above into one. Make sure to add quotes to the string variables and NOT INT
    // const final_query = 

    // db.query('INSERT INTO recipes ("recipeID", "pantryID", "recipeName", "servingSize","ingredients") VALUES ("'+final_query+'")', function(err, results) {
    //     if (err) throw err
    //     //Render same page with newly added ingredient
    //     res.render('add_ingredient',{
    //         title:'Add recipe'
    //     });
    // });

    // //Render newly updated table
    // res.redirect('/ingredients/showall')
    res.send("THIS NEEDS A PAGE WITH A FORM SO WE CAN ADD RECIPES");
})

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