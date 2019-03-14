const express = require('express');
const router = express.Router();
const moment = require('moment');
const ingredient_t = require('../DB_models/Ingredients');

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/showall', function(req, res) {
  // renders showall_recipes with all the available ingredients
  db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null', function(
    err,
    results
  ) {
    for (key in results) {
      results[key]['ingredient_expiration_date'] = moment(
        results[key]['ingredient_expiration_date']
      ).format('LL');
    }
    if (err) throw err;
    res.render('showall_ingredients', {
      title: 'Your Ingredients',
      results: results
    });
  });
});

// POST request to localhost:3000/ingredients/add
// This will add a new ingredient to available ingredients and update database
// Created by Jon
// Last modified: 03/14/2019
// Modified by: Jon
// Modification:
//  created route for single ingredient addition on View Ingredients page
router.post('/showall', function(req, res) {
  // get parameters from request body
  const ingredientName = req.body.ingredient_name;
  const ingredientQuantity = req.body.ingredient_total;
  const ingredientMeasurement = req.body.ingredient_measurement;
  const ingredientExpirationDate = req.body.ingredient_expiration_date;
  // Do crazy stuff here
  result =
    "('" +
    ingredientName +
    "'," +
    ingredientQuantity +
    ",'" +
    ingredientMeasurement +
    "','" +
    ingredientExpirationDate +
    "')";
  db.query(
    'INSERT INTO ingredients (ingredient_name, ingredient_total, ingredient_measurement,ingredient_expiration_date) VALUES ' +
      result,
    function(err, results) {
      if (err) throw err;
    }
  );

  res.redirect('/ingredients/showall');
});

// Render page with a form for adding multiple ingredients
// GET request to localhost:3000/ingredients/add
// Created by: Jon
// Last modified: 03/14/19
// Modified by: Jon
// Modification: Updated route to match new table schema
//  updated route to accept multiple ingredient additions
router.get('/add', function(req, res) {
  res.render('add_ingredient', {
    title: 'Add Multiple Ingredients'
  });
});

// POST request to localhost:3000/ingredients/add
// This will add multiple ingredients to available ingredients and update database
// Created by: Jon
router.post('/add', function(req, res) {
  // Iterate over every key_name inside JSON request
  for (var key in req.body) {
    // When Ingredient key_name is found
    // For every ingredient in the form do the following
    if (key.includes('ingredientProperties')) {
      // Retrieve all values from request body
      const ingredientName = req.body[key][0];
      const ingredientQuantity = req.body[key][1];
      const ingredientMeasurement = req.body[key][2];
      const ingredientExpirationDate = req.body[key][3];
      const ingredientImagePath = 'NULL';
      const ingredientWeight = 'NULL';

      // prettier-ignore
      query =
        "('" +
        ingredientName +
        "'," +
        ingredientQuantity +
        ",'" +
        ingredientMeasurement +
        "','" +
        ingredientExpirationDate +
        "','" +
        ingredientImagePath +
        "'," +
        ingredientWeight +
        ")";
      console.log('Ingredient Name: ' + ingredientName);
      console.log('Ingredient Qty: ' + ingredientQuantity);
      console.log('Ingredient Measurement: ' + ingredientMeasurement);
      console.log('Ingredient Expiration Date: ' + ingredientExpirationDate);
      console.log('Insert into ingredients query: ' + query);

      // Insert ingredient into Ingredients table
      db.query(
        'insert into ingredients (ingredient_name,ingredient_total,ingredient_measurement,ingredient_expiration_date,ingredient_image_path,ingredient_weight) values ' +
          query,
        function(err, results) {
          if (err) throw err;
        }
      );
    }
  }
  res.redirect('showall');
});

// remove ingredient by id
router.delete('/remove/:id', function(req, res) {
  const ingredient = req.params.id;
  const delete_query = "DELETE FROM ingredients WHERE ingredient_name ='" + ingredient + "'";
  db.query(delete_query, function(err, results) {
    if (err) throw err;
    // Since AJAX under /js/main.js made a request we have to respond back
    res.send('Success');
  });
});

// remove ingredient by name
router.delete('/remove/recipe_ingredient/:name', function(req, res) {
  const ingredient = req.params.name;
  console.log('REMOVING');
  console.log(ingredient);
  // Since no cascading is set up have to do it manually
  // delete ingredient from recipe_ingredient table
  const delete_query =
    "DELETE FROM recipe_ingredient WHERE recipe_ingredient_used ='" + ingredient + "'";
  db.query(delete_query, function(err) {
    if (err) throw err;
    // Since AJAX under /js/main.js made a request we have to respond back
  });
  console.log('DONE');
  res.send('Success');
});

module.exports = router;
