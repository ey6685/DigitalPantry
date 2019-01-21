const express = require('express');
const router = express.Router();

//GET request to localhost:3000/recipes/showall
//This will display all available recipes
router.get('/showall', function(req, res){
    db.query('SELECT * FROM recipes', function(err, results) {
        if (err) throw err
        console.log(results[0])
        // res.send(results);
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
    //TODO below change # to a page to render with a .pug extension
    // res.render('#',{
    //     title:"Add New Recipe"
    // });
    res.send('RENDER ADD RECIPE PAGE');
})

//PUT request to localhost:3000/recipes/add
//This will send a request with data of new recipe to the database
router.put('/add', function(req, res){
    res.send('ADDING NEW RECIPE');
})

//DELETE request to localhost:3000/recipes/remove
//This will display all available recipes
router.delete('/remove', function(req, res){
    //TODO logic to delete recipe from database
    res.send('REMOVING RECIPE');
})

module.exports = router;