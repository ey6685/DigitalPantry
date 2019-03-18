const express = require('express')
const router = express.Router()
const moment = require('moment')
const ingredient_t = require('../DB_models/Ingredients')
const ing_in_stock = require('../DB_models/ingredients_in_pantry')
const aw = require('../algorithm/auto_weight')

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/showall', function(req, res) {
  //renders showall_recipes with all the available ingredients

  ////////////////////////////////
  //need to add pantry id feching//
  /////////////////////////////////
  db.query(
    'select ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id and ingredients_in_pantry.ingredient_expiration_date is not null;',
    function(err, results) {
      for (key in results) {
        results[key]['ingredient_expiration_date'] = moment(
          results[key]['ingredient_expiration_date']
        ).format('LL')
      }
      if (err) throw err
      res.render('showall_ingredients', {
        title: 'Your Ingredients',
        results: results
      })
    }
  )
})

// Render page with a form for adding a new ingredient
// GET request to localhost:3000/ingredients/add
router.get('/add', function(req, res) {
  res.render('add_ingredient', {
    title: 'Add Ingredient'
  })
})

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/expiredAdmin', function expiredTable(req, res) {
  //renders showall_recipes with all the available ingredients
  db.query(
    'select ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id and ingredients_in_pantry.ingredient_expiration_date is not null AND ingredient_expiration_date < CURDATE();',
    function(err, results) {
      for (key in results) {
        results[key]['ingredient_expiration_date'] = moment(
          results[key]['ingredient_expiration_date']
        ).format('LL')
      }
      if (err) throw err
      res.render('expiredAdmin_ingredients', {
        title: 'Your Expired Ingredients',
        results: results
      })
    }
  )
})

// POST request to localhost:3000/ingredients/add
// This will add a new ingredient to available ingredients and update database
router.post('/add', async function(req, res) {
  for (var key in req.body) {
    if (key.includes('ingredientProperties')) {
      var block_oF_data = req.body[key]
      console.log(block_oF_data)
      //seperate the data
      var ingredient_name = block_oF_data[0]
      var ingredient_amount = block_oF_data[1]
      var ingredient_unit = block_oF_data[2]
      var ingredient_date = block_oF_data[3]
      var final_id

      var does_ingredient_exist = await ingredient_t.findOne({
        where: {
          ingredient_name: ingredient_name
        }
      })

      if (does_ingredient_exist != null) {
        final_id = does_ingredient_exist.ingredient_id
      } else {
        var new_weight = await aw.auto_weight(ingredient_name)
        var new_ingredient = await ingredient_t.create({
          ingredient_name: ingredient_name,
          ingredient_weight: new_weight
        })
        final_id = new_ingredient.ingredient_id
      }

      var new_inv = ing_in_stock.create({
        pantry_id: 1, //change to get this from the sesson
        ingredient_id: final_id,
        ingredient_amount: ingredient_amount,
        ingredient_unit_of_measurement: ingredient_unit,
        ingredient_expiration_date: ingredient_date
      })
      console.log('ingredient add: \n' + JSON.stringify(new_inv))
    }
  }
  res.redirect('/ingredients/showall')
})
//Render page with data from database
//GET request to localhost:3000/ingredients/cards
router.get('/cards', function showCards(req, res) {
  const query =
    'select ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id and ingredients_in_pantry.ingredient_expiration_date is not null;'
  db.query(query, function getResults(err, results) {
    for (key in results) {
      results[key]['ingredient_expiration_date'] = moment(
        results[key]['ingredient_expiration_date']
      ).format('LL')
    }
    if (err) throw err
    res.render('showall_ingredients_cards', {
      title: 'Your Ingredients',
      results: results
    })
  })
})

//remove ingredient by id
router.delete('/remove/', async function(req, res) {
  const ingredient = req.body.id
  var ex_date = req.body.ex
  const unit = req.body.unit
  const qty = req.body.qty
  ex_date = await new Date(ex_date)
  ex_date = await moment(ex_date).format('YYYY-MM-DD')
  // ex_date = await moment(ex_date).format("L");
  // ex_date = await ex_date.split('/');
  // ex_date = ex_date[2] + '-' + ex_date[1] + '-' + ex_date[0];
  const delete_query =
    "DELETE FROM ingredients_in_pantry WHERE ingredient_id ='" +
    ingredient +
    "' and ingredient_expiration_date= '" +
    ex_date +
    "' and ingredient_unit_of_measurement= '" +
    unit +
    "' and ingredient_amount = '" +
    qty +
    "';"
  // db.query(delete_query, function(err, results) {
  //     if (err) throw err
  //     //Since AJAX under /js/main.js made a request we have to respond back
  //     res.send("Success");
  // });

  console.log('\ningredient id: ' + ingredient + '\ndelete query: ' + delete_query)

  // ing_in_stock.destroy({
  //     where:{
  //         ingredient_id: ingredient,
  //         ingredient_expiration_date: ex_date,
  //         ingredient_unit_of_measurement: unit,
  //         ingredient_amount : qty
  //     }
  // })
  // .then(results => {
  //     console.log(JSON.stringify(results));
  //     res.send("Success");
  // })
  db.query(delete_query, results => {
    console.log(results)
    res.send('success')
  })
})

// remove ingredient by id
router.delete('/remove/', async function(req, res) {
  const ingredient = req.body.id
  var ex_date = req.body.ex
  const unit = req.body.unit
  const qty = req.body.qty
  ex_date = await new Date(ex_date)
  ex_date = await moment(ex_date).format('YYYY-MM-DD')
  // ex_date = await moment(ex_date).format("L");
  // ex_date = await ex_date.split('/');
  // ex_date = ex_date[2] + '-' + ex_date[1] + '-' + ex_date[0];
  const delete_query =
    "DELETE FROM ingredients_in_pantry WHERE ingredient_id ='" +
    ingredient +
    "' and ingredient_expiration_date= '" +
    ex_date +
    "' and ingredient_unit_of_measurement= '" +
    unit +
    "' and ingredient_amount = '" +
    qty +
    "';"
  // db.query(delete_query, function(err, results) {
  //     if (err) throw err
  //     //Since AJAX under /js/main.js made a request we have to respond back
  //     res.send("Success");
  // });

  console.log('\ningredient id: ' + ingredient + '\ndelete query: ' + delete_query)

  // ing_in_stock.destroy({
  //     where:{
  //         ingredient_id: ingredient,
  //         ingredient_expiration_date: ex_date,
  //         ingredient_unit_of_measurement: unit,
  //         ingredient_amount : qty
  //     }
  // })
  // .then(results => {
  //     console.log(JSON.stringify(results));
  //     res.send("Success");
  // })
  db.query(delete_query, results => {
    console.log(results)
    res.send('success')
  })
})

// remove ingredient by name
router.delete('/remove/recipe_ingredient/:name', function(req, res) {
  const ingredient = req.params.name
  console.log('REMOVING')
  console.log(ingredient)
  // Since no cascading is set up have to do it manually
  // delete ingredient from recipe_ingredient table
  const delete_query =
    "DELETE FROM recipe_ingredient WHERE recipe_ingredient_used ='" + ingredient + "'"
  db.query(delete_query, function(err) {
    if (err) throw err
    // Since AJAX under /js/main.js made a request we have to respond back
  })
  console.log('DONE')
  res.send('Success')
})

module.exports = router
