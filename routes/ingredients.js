const express = require('express');
const router = express.Router();
const moment = require('moment');
const ingredient_t = require('../DB_models/Ingredients');
const ing_in_stock = require('../DB_models/ingredients_in_pantry');
const aw = require('../algorithm/auto_weight');


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

//Render page with data from database
//GET request to localhost:3000/users/login
router.get('/expiredAdmin', function(req, res) {
  //renders showall_recipes with all the available ingredients
  db.query(
    'SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null AND ingredient_expiration_date < CURDATE() ',
    function(err, results) {
      for (key in results) {
        results[key]['ingredient_expiration_date'] = moment(
          results[key]['ingredient_expiration_date']
        ).format('LL');
      }
      if (err) throw err;
      res.render('expiredAdmin_ingredients', {
        title: 'Your Expired Ingredients',
        results: results
      });
    }
  );
});

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
            //add weight asigning function call here
            var new_weight = await aw.auto_weight(ing_ingredient_name);
            new_ingredient = await ingredient_t.create({
                ingredient_name: ing_ingredient_name,
                ingredient_weight: new_weight
            });
            new_ing_id = new_ingredient.ingredient_id;
        }

        ing_in_stock.create({
            ingredient_id: new_ing_id,
            pantry_id : 1,//change to get pantry id form the session
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
router.delete('/remove/', async function(req,res){
    const ingredient = req.body.id;
    var ex_date = req.body.ex;
    const unit = req.body.unit;
    const qty = req.body.qty;
    ex_date =  await new Date(ex_date);
    ex_date = await moment(ex_date).format("YYYY-MM-DD");
    // ex_date = await moment(ex_date).format("L");
    // ex_date = await ex_date.split('/');
    // ex_date = ex_date[2] + '-' + ex_date[1] + '-' + ex_date[0];
    const delete_query = "DELETE FROM ingredients_in_pantry WHERE ingredient_id ='"+ingredient+"' and ingredient_expiration_date= '" + ex_date +"' and ingredient_unit_of_measurement= '" + unit +"' and ingredient_amount = '" + qty +"';";
    // db.query(delete_query, function(err, results) {
    //     if (err) throw err
    //     //Since AJAX under /js/main.js made a request we have to respond back
    //     res.send("Success");
    // });
    
    console.log("\ningredient id: " + ingredient + "\ndelete query: " + delete_query);

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
    db.query(delete_query,results=>{
        console.log(results);
        res.send("success");
    })



})

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
