const express = require('express');
const router = express.Router();
const recipe_t = require('../DB_models/Recipes');
const ingredient_t = require('../DB_models/Ingredients')
const IiR_t = require('../DB_models/ingredients_in_a_recipe');
const op = require('sequelize').Op;
const multer = require('multer');
const steps = require('../recipe_direction_parser');
const users_route = require('./users');
const aw = require("../algorithm/auto_weight");
//defines where to store image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/../public/images/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// create an upload function using configuration above
const upload = multer({ storage: storage });

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/showall
DESCRIPTION: This will display all available recipes that are pulled from database
*/
router.get('/showall', async function(req, res){
    // db.query('SELECT * FROM recipes', function(err, results) {
    //     if (err) throw err
    //     res.render('showall_recipes',{
    //         title: "Your Recipes",
    //         results: results
    //     })
    //   })
    try{
        var recipe_res = await recipe_t.findAll({

        });
        console.log("the recipes: \n" + JSON.stringify(recipe_res));
        console.log("length: " + recipe_res.length); 
        // var IiR_res = await IiR_t.findAll({});
        // console.log("Iir_res: \n" + JSON.stringify(IiR_res));
        //make string array that we will be storeing the ingredient  sting
        var ingredient_list = new Array(recipe_res.length).fill('');
        console.log("starting ingreditents list: \n" + ingredient_list);
        
    

    // grabs the ingredient names for the ingredients tables for each recipe id
    // and stores them in to ingredients list in a formated str where
    // each ingredient is seperated by a #


    //grabs the ingredient names for the ingredients tables for each recipe id
    //and stores them in to ingredients list in a formated str where
    //each ingredient is seperated by a #
    
        var ing_res;
        console.log('starting for loop');
        for(var i=0; i<recipe_res.length;i++)
        {
            var IiR_res = await IiR_t.findAll({
                where:{
                    recipe_id: recipe_res[i].recipe_id
                }
            });
            console.log("\ningredients for recipe " + recipe_res[i].recipe_id +'\n' + JSON.stringify(IiR_res));
            for(var o=0; o<IiR_res.length;o++)
            {
                var new_ingredient = await ingredient_t.findOne({
                    attributes: ['ingredient_name'],
                    where:{
                        ingredient_id: IiR_res[o].ingredient_id
                    }
                });
                if(ingredient_list[i] != '')
                    ingredient_list[i] = ingredient_list[i] + "#";
                ingredient_list[i] = ingredient_list[i]   + new_ingredient.ingredient_name + ", " + IiR_res[o].amount_of_ingredient_needed + " " + IiR_res[o].ingredient_unit_of_measurement; 
            }
        }
         for(var i =0; i<ingredient_list.length; i++)
        {
            ingredient_list[i] = ingredient_list[i].split("#");
        }
        console.log(ingredient_list);
        res.render('showall_recipes', {
            title: 'Your Recipes',
            results: recipe_res,
            ingredients: ingredient_list
          });
    }
    catch(err)
    {
        console.log(err);
    }
})




router.get('/showRecipes', function(req, res){
    query = "SELECT * FROM recipes;";
    recipe_steps_array = []
    db.query(query, async function(err, results){
        if (err) throw err;
        console.log(results);
        for (every_recipe_directions in results){
            var recipe_steps = await steps.parse_recipe_directions_by_string(results[every_recipe_directions].recipe_directions);
            recipe_steps_array.push(recipe_steps.split('${<br>}'));
        }
        console.log(recipe_steps_array);
        res.render("showRecipes",{
            title:"Your Recipes",
            data: results,
            recipe_steps:recipe_steps_array
        })
    })
})

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/showComunityRecipes
DESCRIPTION: This will display all recipes withing the community
*/
router.get('/showCommunityRecipes', async function(req,res){
    query = 'SELECT * FROM recipes WHERE sharable = 1;';
    console.log("Session");
    //Prints user id stored in the session. Can be used to determine which pantry user belongs to
    // console.log(req.session.passport['user']);
    recipe_steps_array = []
    
    db.query(query, async function(err, results) {
        if (err) throw err;
        for (every_recipe_directions in results){
            var recipe_steps = await steps.parse_recipe_directions_by_string(results[every_recipe_directions].recipe_directions);
            recipe_steps_array.push(recipe_steps.split('${<br>}'));
        }
        console.log(results);
        res.render('comunity_recipes',{
            title:"Community Recipes",
            recipe_steps:recipe_steps_array,
            data:results
        });
    });
  });

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/add
DESCRIPTION: This will render add recipe page with a form
*/
router.get('/add', function(req, res) {
  res.render('add_recipe', {
    title: 'Add New Recipe'
  });
});

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
// calls upload function for images
router.post('/add', upload.single('image'), async function(req, res) {
  console.log(req.file);
  if (req.file) {
    console.log('Uploading file...');
    console.log('File Uploaded Successfully');
  } else {
    console.log('No File Uploaded');
    console.log('File Upload Failed');
  }
  // recipe_name and recipe_size are unique form fields, so they do not require any recursion to grab all of them
  const recipeName = req.body.recipeName;
  const recipeServingSize = req.body.recipeServingSize;
  var recipeDirections = req.body.recipeDirections;
  var replaceNewLine = '#';
  for (char in recipeDirections) {
    replaceNewLine = replaceNewLine.concat(
      recipeDirections[char].replace('\r', '').replace('\n', '#')
    );
  }

  //***************************
  //TODO add pantry ID here
  //***************************

    //Create entire query value
    var query = "('" + recipeName + "','" + recipeServingSize + "','" + replaceNewLine + "', 1)";///change that last '1' to gettingthe pantry id
    console.log("Recipe Name: " + recipeName);
    console.log("Recipe Serving Size: " + recipeServingSize);
    console.log("Insert into Recipe Query: " + query);
    //Insert Recipe name and size into a table first
    // db.query('insert into recipe (name) values ('+'"'+req.body.recipe_name+'"'+')', function(err, results) {
    await db.query('insert into recipes (recipe_name,num_people_it_feeds,recipe_directions,pantry_id) values ' + query, async function(err, results) {
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
                var ingredient_data_from_page =  req.body[key][1];
                console.log("//////////////////////////////////////////\n" +JSON.stringify(ingredient_data_from_page) +"\n////////////////////////////////////\n");
                // const ingredientName = req.body[key][0];
                // const ingredientQuantity = req.body[key][1];
                // const ingredientMeasurement = req.body[key][2];

                const ingredientName = ingredient_data_from_page[0];
                const ingredientQuantity = ingredient_data_from_page[1];
                const ingredientMeasurement = ingredient_data_from_page[2];
                console.log("adding ingredient to recipe: \n")// + ingredientQuantity+ " " +ingredientMeasurement+" of " + ingredientName);
                console.log("ingredientName: " + ingredientName);
                console.log("ingredientQTY: " + ingredientQuantity);
                console.log("ingredientMeasurement: " + ingredientMeasurement);

                //find if the ingredient is in db
                var final_ingredi_id;
                var checking_ingr_t = await ingredient_t.findAll({
                    where:{
                        ingredient_name : ingredientName
                        
                    }
                });
                if(checking_ingr_t.length>0)
                {
                    final_ingredi_id = checking_ingr_t[0].ingredient_id;
                }
                else
                {
                    var ingredient_weight = await aw.auto_weight(ingredientName);
                    var new_ingredient = await ingredient_t.create({
                        ingredient_name: ingredientName,
                        ingredient_weight : ingredient_weight,
                        });
                    final_ingredi_id = new_ingredient.ingredient_id;
                }
                var new_ingredient_slot = await IiR_t.create({
                    ingredient_id : final_ingredi_id,
                    recipe_id : recipe_id_inserted,
                    ingredient_unit_of_measurement: ingredientMeasurement,
                    pantry_id: 1,//change this to be from the session
                    amount_of_ingredient_needed: ingredientQuantity
                });
                console.log("created ingredient slot: \n" + JSON.stringify(new_ingredient_slot));

                // query = "('"+ingredientName+"',"+ingredietQuantity+",'"+ingredientMeasurement+"','" + ingredientExpirationDate + "')";
                // console.log("Ingredient Name: " + ingredientName);
                // console.log("Ingredient Qty: " + ingredietQuantity);
                // console.log("Ingredient Measurement: " + ingredientMeasurement);
                // console.log("Insert into ingredients query: " + query);
                // //Insert ingredient into a Ingredients table
                // await db.query('insert into ingredients (ingredient_name,ingredient_total,ingredient_measurement,ingredient_expiration_date) values '+query, async function(err, results) {
                //     if (err) throw err
                //     //Get inserted ingredient's row id, this works because auto-increment is set in the table
                //     ingredients_ids_inserted = results.insertId;
                //     //Create values that will be inserted into recipe_ingredient table
                //     //recipe_ingredients is what links ingredients to the recipe
                //     values = recipe_id_inserted + ',' + ingredients_ids_inserted
                //     // query = "("+ingredients_ids_inserted + "," + ingredietQuantity + "," + recipe_id_inserted + ",'" + ingredientMeasurement + "')";
                //     query = "("+ingredients_ids_inserted + "," + recipe_id_inserted + "," + ingredietQuantity + ",'" + ingredientMeasurement + "')";

                //     //***************************
                //     //TODO add pantry ID here
                //     //***************************

                    // await db.query('insert into recipe_ingredient (ingredient_id,recipe_id,amount_of_ingredient_needed,ingredient_unit_of_measurement) values ' + query, async function(err, results) {
                    //     if (err) throw err
                    // });

    //             });
            }
    //     //Repeat until all recipes have been parsed
        }
    // });

    // res.send(req.body.ingredientName[1]);
    // This will respond with the parameters that you sent in your request
    // TODO redirect to another page
    res.redirect("showall");
})});

// Get all available recipes that a single pantry has
// Returns a JSON result
router.get('/getPantryRecipes', function(req, res) {
  // get id of the currently logged in user
  var user_id = req.session.passport['user'];
  // query all recipes which are availabel to this user
  query =
    'SELECT * FROM recipes WHERE pantry_id = (SELECT pantry_id FROM users WHERE user_id=' +
    user_id +
    ');';
  db.query(query, function(err, results) {
    if (err) throw err;
    // return JSON data
    res.json(results);
  });
});

//Get all available recipes that a single pantry has
//Returns a JSON result
router.get('/getPantryRecipes', function(req, res){
    console.log(req.session.passport['user']);
    //get id of the currently logged in user
    var user_id = req.session.passport['user'];
    //query all recipes which are availabel to this user
    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////hey oskars change this to pantry id to how we are finding it from the secceson//
    //////////////////////////////////////////////////////////////////////////////////////////////
    query = 'SELECT * FROM recipes WHERE pantry_id = ' +pantry_id + "';";
    db.query(query, function(err, results){
        if (err) throw err;
        res.send('success');
      });
    
    
});


//Share a recipe into community
router.post('/share', async function(req, res){
    share_query=`UPDATE recipes SET sharable=1 WHERE recipe_name='${req.body.recipe_name}';`
    await db.query(share_query, function(err, results){
        if (err) throw err;
        console.log(results);
    });

    //note to others : dont really want to delete this chunch of code just in case, k thanks///////
    
    // await db.query("SELECT * FROM recipes WHERE recipe_name='"+req.body.recipe_name+"';", async function(err, results){
    //     if (err) throw err;
    //     var r_name = results[0].recipe_name;
    //     var r_serving_size = results[0].recipe_serving_size;
    //     var r_directions = results[0].recipe_directions;
    //     var r_image_path = results[0].recipe_image_path
    //     values = "('"+r_name+"',"+r_serving_size+",'"+r_directions+"','"+r_image_path+"');"
    //     add_to_community_query="INSERT INTO community_recipes (c_recipe_name,c_recipe_serving_size,c_recipe_directions,c_recipe_image_path) VALUES " + values;
    //     console.log(add_to_community_query);
    //     await db.query(add_to_community_query, function(err, results){
    //         if (err) throw err;
    //         console.log("Recipe Shared to Community");
    //     })
    // })
    res.send("success");
})





router.post('/edit', function(req, res){
    //get all data from the body
    data = req.body;
    //$1 - recipe_name
    //$2 - recipe_serving_size
    //$3 - recipe_id
    query = "UPDATE recipes SET $1, $2 WHERE $3;";
    //In this loop we will build above query
    for (key in data){
        //Recipe Name handling
        if(key.includes('currentName')){
            //Split currentRecipe parameter. results in array
            recipeId = key.split(':');
            //Get recipeID from the array
            recipeId = "recipe_id="+recipeId[1]
            //Replace $3 with recipe ID for the query
            query = query.replace('$3', recipeId);
            if(data[key] == ""){
                //If recipe name was not changed remove extra parameters from the query
                query = query.replace('$1', '');
                query = query.replace(',', '');
                console.log("NAME NOT CHANGED");
            }
            else{
                recipe_name_query_parameter = 'recipe_name="' + data[key] + '"';
                //Replace $1 with new recipe name
                query = query.replace('$1', recipe_name_query_parameter);
            }
        }
        //Recipe serving size handling
        if(key.includes('currentServSize')){
            if(data[key] == ""){
                //If recipe serving size was not changed remove extra parameters from the query
                query = query.replace('$2', '');
                query = query.replace(',', '');
            }
            else{
                recipe_name_query_parameter = "recipe_people_it_feeds=" + data[key];
                //Replace $2 with new recipe name
                query = query.replace('$2', recipe_name_query_parameter);
                console.log(query);
            }
        }
        
    }
    // Recipe serving size handling
    if (key.includes('currentServSize')) {
      if (data[key] == '') {
        // If recipe serving size was not changed remove extra parameters from the query
        query = query.replace('$2', '');
        query = query.replace(',', '');
      } else {
        recipe_name_query_parameter = 'recipe_serving_size=' + data[key];
        // Replace $2 with new recipe name
        query = query.replace('$2', recipe_name_query_parameter);
        console.log(query);
      }
    }
  
  db.query(query, function(err, results) {
    if (err) throw err;
    console.log('Values are updated');
  });
  res.send(req.body);
});

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

router.delete('/remove/:id', async function(req, res){
    const recipe = req.params.id;
    // const delete_query = "DELETE FROM recipes WHERE recipe_id ='"+recipe+"'";
    // db.query(delete_query, function(err, results) {
    //     if (err) throw err

    //first need to get rid of all the foriegn keys
    try
    {
        var del_IiR = await IiR_t.destroy({
            where:
            {
                recipe_id: recipe
            }
        });
        console.log("delete from ingredients in a recipe table: \n" + JSON.stringify(del_IiR));
        var del_recipe = await recipe_t.destroy({
            where:{
                recipe_id : recipe
            }
        });
        console.log("delete from recieps table: \n" + JSON.stringify(del_recipe));
        res.send("Success");
    }
    catch(err)
    {
        console.log(err);
        res.send("no?")// i dont know ajax calls............
    }
        //Since AJAX under /js/main.js made a request we have to respond back
        
    // });
})

module.exports = router;
