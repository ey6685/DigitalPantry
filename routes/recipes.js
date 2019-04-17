const express = require('express')
const router = express.Router()
const recipe_t = require('../DB_models/Recipes')
const ingredient_t = require('../DB_models/Ingredients')
const User = require('../DB_models/Users')
const Pantry = require('../DB_models/Pantry')
const IiR_t = require('../DB_models/ingredients_in_a_recipe')
const op = require('sequelize').Op
const moment = require('moment')
const multer = require('multer')
const steps = require('../recipe_direction_parser')
const users_route = require('./users')
const aw = require('../algorithm/auto_weight')
const base_recipe_w = require('../algorithm/recipe_weight_functions')
const gm = require('gm')
const fs = require('fs')
const input_cleaner = require('../functions/Input_cleaner')
const val = require("validator")
//defines where to store image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/../public/images/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
// create an upload function using configuration above
const upload = multer({ storage: storage })

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/showall
DESCRIPTION: This will display all available recipes that are pulled from database
*/
router.get('/showall', async function(req, res) {
  userPantryId = req.user.pantry_id
  try {
    var recipe_res = await recipe_t.findAll({
      where: { pantry_id: userPantryId }
    })
    console.log('the recipes: \n' + JSON.stringify(recipe_res))
    console.log('length: ' + recipe_res.length)
    if (recipe_res.length > 0) {
      // var IiR_res = await IiR_t.findAll({});
      // console.log("Iir_res: \n" + JSON.stringify(IiR_res));
      //make string array that we will be storeing the ingredient  sting
      var ingredient_list = new Array(recipe_res.length).fill('')
      console.log('starting ingreditents list: \n' + ingredient_list)

      // grabs the ingredient names for the ingredients tables for each recipe id
      // and stores them in to ingredients list in a formated str where
      // each ingredient is seperated by a #

      //grabs the ingredient names for the ingredients tables for each recipe id
      //and stores them in to ingredients list in a formated str where
      //each ingredient is seperated by a #

      console.log('starting for loop')
      for (var i = 0; i < recipe_res.length; i++) {
        var IiR_res = await IiR_t.findAll({
          where: {
            recipe_id: recipe_res[i].recipe_id
          }
        })
        console.log(
          '\ningredients for recipe ' + recipe_res[i].recipe_id + '\n' + JSON.stringify(IiR_res)
        )
        for (var o = 0; o < IiR_res.length; o++) {
          var new_ingredient = await ingredient_t.findOne({
            attributes: ['ingredient_name'],
            where: {
              ingredient_id: IiR_res[o].ingredient_id
            }
          })
          if (ingredient_list[i] != '') ingredient_list[i] = ingredient_list[i] + '#'
          ingredient_list[i] =
            ingredient_list[i] +
            new_ingredient.ingredient_name +
            ', ' +
            IiR_res[o].amount_of_ingredient_needed +
            ' ' +
            IiR_res[o].ingredient_unit_of_measurement
        }
      }
      for (var i = 0; i < ingredient_list.length; i++) {
        ingredient_list[i] = ingredient_list[i].split('#')
      }
      var data = await ingredient_t.findAll({})
    }
    res.render('showall_recipes', {
      title: 'Your Recipes',
      results: recipe_res,
      ingredients: ingredient_list,
      data: JSON.stringify(data)
    })
  } catch (err) {
    console.log(err)
  }
})

router.get('/showRecipes', async function showRecipes(req, res) {
  userPantryId = req.user.pantry_id
  // Get all available recipes
  const results = await recipe_t.findAll({ where: { pantry_id: userPantryId } })
  const recipeStepsArray = []
  if (results.length > 0) {
    for (every_recipe_directions in results) {
      const recipe_steps = await steps.parse_recipe_directions_by_string(
        results[every_recipe_directions].recipe_directions
      )
      recipeStepsArray.push(recipe_steps.split('${<br>}'))
    }
    //code to copy to get the edit menu to work.
    var ingredient_list = new Array(results.length).fill('')
    console.log('starting ingreditents list: \n' + ingredient_list)
    for (var i = 0; i < results.length; i++) {
      //grabs the ingredient names for the ingredients tables for each recipe id
      //and stores them in to ingredients list in a formated str where
      //each ingredient is seperated by a #
      var IiR_res = await IiR_t.findAll({
        where: {
          recipe_id: results[i].recipe_id
        }
      })
      console.log(
        '\ningredients for recipe ' + results[i].recipe_id + '\n' + JSON.stringify(IiR_res)
      )
      for (var o = 0; o < IiR_res.length; o++) {
        var new_ingredient = await ingredient_t.findOne({
          attributes: ['ingredient_name'],
          where: {
            ingredient_id: IiR_res[o].ingredient_id
          }
        })
        if (ingredient_list[i] != '') ingredient_list[i] = ingredient_list[i] + '#'
        ingredient_list[i] =
          ingredient_list[i] +
          new_ingredient.ingredient_name +
          ', ' +
          IiR_res[o].amount_of_ingredient_needed +
          ' ' +
          IiR_res[o].ingredient_unit_of_measurement
      }
    }
    for (var i = 0; i < ingredient_list.length; i++) {
      ingredient_list[i] = ingredient_list[i].split('#')
    }

    var ings = await ingredient_t.findAll({})
    console.log(JSON.stringify(ingredient_list))
  }
  res.render('showRecipes', {
    title: 'Your Recipes',
    results: results,
    str_res: JSON.stringify(results),
    recipe_steps: recipeStepsArray,
    ingredients: ingredient_list,
    data: JSON.stringify(ings)
  })
})

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/showComunityRecipes
DESCRIPTION: This will display all recipes withing the community
*/
router.get('/showCommunityRecipes', async function showCommunityRecipes(req, res) {
  // Get all recipes that are begin shared
  const results = await recipe_t.findAll({
    where: {
      sharable: 1
    }
  })
  const recipeStepsArray = []
  for (every_recipe_directions in results) {
    var recipe_steps = await steps.parse_recipe_directions_by_string(
      results[every_recipe_directions].recipe_directions
    )
    recipeStepsArray.push(recipe_steps.split('${<br>}'))
  }
  res.render('comunity_recipes', {
    title: 'Community Recipes',
    recipe_steps: recipeStepsArray,
    data: results
  })
})

/*
TYPE: GET
URL ENDPOINT: localhost:3000/recipes/add
DESCRIPTION: This will render add recipe page with a form
*/
router.get('/add', function(req, res) {
  res.render('add_recipe', {
    title: 'Add New Recipe'
  })
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
// calls upload function for images
router.post('/add', upload.single('image'), async function addRecipe(req, res) {
  var recipe_name = await input_cleaner.string_cleaning(req.body.recipeName)
  var name_is_open = await recipe_t.findAll({
    where: {
      recipe_name:await recipe_name
    }
  })
  //check if it is already in the database.
  console.log('++++++++++')
  console.log(JSON.stringify(name_is_open))
  console.log("++++++++++")
  if(name_is_open.length> 0)
  {
    req.flash('error',"Recipe " + recipe_name + " already exist. please rename your new recipe")
    res.render('add_recipe', {
      title: 'Add New Recipe'
    })
  }
  const userId = req.session.passport['user']
  // Get pantry ID which user belongs to
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: {
      user_id: userId
    }
  })

  // If file exists
  if (req.file) {
    console.log('File Uploaded Successfully')
    var currentDate = Date.now()
    var imagePath = currentDate + '.jpg'
    gm(req.file.path) // uses graphicsmagic and takes in image path
      .resize(1024, 576, '!') // Sets custom weidth and height, and ! makes it ignore aspect ratio, thus changing it. Then overwrites the origional file.
      .write(req.file.path, err => {
        fs.rename(req.file.path, './public/images/' + currentDate + '.jpg', function(err) {
          if (err) throw err
          console.log('File Renamed.')
        })
        if (err) {
          console.log(err)
        }
      })
  } else {
    var imagePath = 'placeholder.jpg'
    console.log('File Upload Failed')
  }
  // recipe_name and recipe_size are unique form fields, so they do not require any recursion to grab all of them
  //const recipeName = input_cleaner.string_cleaning(req.body.recipeName)
  const recipeServingSize = (req.body.recipeServingSize)
  const recipeDirections = (req.body.recipeDirections)
  const recipeShareable = req.body.recipeShareable
  let replaceNewLine = '#'
  for (char in recipeDirections) {
    replaceNewLine = replaceNewLine.concat(
      recipeDirections[char].replace('\r', '').replace('\n', '#')
    )
  }
  // INSERT new recipe information into table
  const result = await recipe_t
    .create({
      recipe_name: recipe_name,
      recipe_image_path: '/images/' + imagePath, //saves image path in the db in a way that can be pulled from to display later
      num_people_it_feeds: recipeServingSize,
      sharable: parseInt(recipeShareable),
      recipe_directions: replaceNewLine,
      pantry_id: pantryId.pantry_id
    })
    .catch(function handleError(err) {
      throw err
    })
  // Get id of the inserted row
  // NO IDEA why seequalize responds with a JSON object where inserted ID has attribute of null LOL
  const recipe_id_inserted = result['null']

  // Iterate over every key_name inside JSON request
  // var key = req.body
  // When Ingredient key_name is found
  // For every ingredient in recipe defined by user in the form do the following
  for(var i =1; i < req.body.ingredientProperties.length; i++)
  {
        console.log(req.body.ingredientProperties)
        var ingredient_data_from_page = req.body.ingredientProperties[i]

        const ingredientName = await input_cleaner.string_cleaning(ingredient_data_from_page[0])
        const ingredientQuantity =ingredient_data_from_page[1]
        const ingredientMeasurement = ingredient_data_from_page[2]
        console.log("adding ingredient to recipe: \n")// + ingredientQuantity+ " " +ingredientMeasurement+" of " + ingredientName);
        console.log("ingredientName: " + ingredientName);
        console.log("ingredientQTY: " + ingredientQuantity);
        console.log("ingredientMeasurement: " + ingredientMeasurement);

   
      //find if the ingredient is in db
      var final_ingredi_id
      var checking_ingr_t = await ingredient_t.findAll({
        where: {
          ingredient_name: ingredientName
        }
      })
      if (checking_ingr_t.length > 0) {
        final_ingredi_id = checking_ingr_t[0].ingredient_id
      } else {
        var ingredient_weight = await aw.auto_weight(ingredientName)
        var new_ingredient = await ingredient_t.create({
          ingredient_name: ingredientName,
          ingredient_weight: ingredient_weight
        })
        final_ingredi_id = new_ingredient.ingredient_id
      }
      var new_ingredient_slot = await IiR_t.create({
        ingredient_id: final_ingredi_id,
        recipe_id: recipe_id_inserted,
        ingredient_unit_of_measurement: ingredientMeasurement,
        pantry_id: pantryId.pantry_id, //change this to be from the session
        amount_of_ingredient_needed: ingredientQuantity
      })
      console.log('created ingredient slot: \n' + JSON.stringify(new_ingredient_slot))
    
  
    }
  //Repeat until all recipes have been parsed

  res.redirect('showall')
})

// Get all available recipes that a single pantry has
// Returns a JSON result
router.get('/getPantryRecipes', async function getPantryRecipes(req, res) {
  // get id of the currently logged in user
  const userId = req.session.passport['user']
  // get the pantry id the user is part of
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: {
      user_id: userId
    }
  })
  // query all recipes which are available to current user
  const result = await recipe_t.findAll({
    where: {
      pantry_id: pantryId.pantry_id,
      sharable: 0
    }
  })
  // return JSON data
  console.log(result)
  res.json(result)
})

router.get('/getRecipeDirections/:id', async function getDirections(req, res) {
  const recipeId = req.params.id
  const directions = await recipe_t.findOne({
    attributes: ['recipe_directions'],
    where: { recipe_id: recipeId }
  })
  const recipe_steps = await steps.parse_recipe_directions_by_string(directions.recipe_directions)
  let recipeStepsArray = recipe_steps.split('${<br>}')
  res.json(recipeStepsArray)
})

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
  res.send('success')
})

router.get('/recipeDetails/:id', async function showDetails(req, res) {
  // Get current user from session auth
  const userId = req.session.passport['user']
  // Get pantry ID which user belongs to
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: {
      user_id: userId
    }
  })

  peopleToCookFor = await Pantry.findOne({
    attributes: ['people_cooking_for'],
    where: {
      pantry_id: pantryId.pantry_id
    }
  })
  //Get recipe id of the recipe being cooked
  recipeId = req.params.id
  //Get recipe information from the database such as steps and serving size
  recipeData = await recipe_t.findOne({
    where: { recipe_id: recipeId }
  })

  recipe_steps = await steps.parse_recipe_directions_by_string(recipeData.recipe_directions)
  recipe_steps = recipe_steps.split('${<br>}')

  query = `select ingredients_in_pantry.ingredient_expiration_date, ingredients_in_pantry.ingredient_id, ingredients.ingredient_name, ingredients.ingredient_image_path,ingredients_in_a_recipe.pantry_id,ingredients_in_a_recipe.amount_of_ingredient_needed,ingredients_in_a_recipe.ingredient_unit_of_measurement 
  FROM ingredients
  INNER JOIN ingredients_in_a_recipe
  INNER JOIN ingredients_in_pantry
  WHERE ingredients_in_pantry.ingredient_id = ingredients.ingredient_id AND ingredients.ingredient_id = ingredients_in_a_recipe.ingredient_id AND ingredients_in_a_recipe.recipe_id =${recipeId};`
  db.query(query, function getResults(err, ingredientsInRecipe) {
    if (err) {
      throw err
    }
    var JSONObj = {
      recipeId: recipeId,
      recipeData: recipeData,
      ingredientData: ingredientsInRecipe
    }

    res.render('cooked_recipe_details', {
      wholeRecipe: JSON.stringify(JSONObj),
      peopleToCookeFor: peopleToCookFor.people_cooking_for,
      recipeName: recipeData.recipe_name,
      recipeImage: recipeData.recipe_image_path,
      recipeSteps: recipe_steps,
      recipeId: recipeId,
      servingSize: recipeData.num_people_it_feeds,
      cookedCount: recipeData.recipe_num_times_cooked,
      recipeIngredients: ingredientsInRecipe
    })
  })
})

router.post('/undo', async function undoCooking(req, res) {
  cookedRecipeData = JSON.parse(req.body.cookedRecipe)
  counter = 0
  for (ingredient in cookedRecipeData.ingredientData) {
    counter = counter + 1
    //Get all info from ingredient (id, name, size, etc)
    ingredientInfo = cookedRecipeData.ingredientData[ingredient]
    //Get ingredients ID
    ingrdientId = ingredientInfo.ingredient_id
    //Get ingredients expiration date
    ingredientExpirationDate = ingredientInfo.ingredient_expiration_date
    ingredientExpirationDate = moment(ingredientExpirationDate).format('YYYYMMDD')
    // Get ingredients amount needed for the recipe
    amountNeeded = ingredientInfo.amount_of_ingredient_needed
    //Add amount of used ingredient back into tables since user decided to undo cooked recipe.
    query = `UPDATE ingredients_in_pantry SET ingredient_amount = ingredient_amount + ${amountNeeded}, ingredient_expiration_date = '${ingredientExpirationDate}' WHERE ingredient_id=${ingrdientId};`
    await db.query(query, function dbResponse(err) {
      if (err) {
        throw err
      }
    })
  }
  if (counter == cookedRecipeData.ingredientData.length) {
    res.send('success')
  }
})

router.post('/edit', async function editRecipe(req, res) {
  //UPDATE
  const recipeName = await input_cleaner.string_cleaning(req.body.recipeName)
  const recipeSize = await input_cleaner.string_cleaning(req.body.recipeSize)
  const recipeId = await input_cleaner.string_cleaning(req.body.recipeId)
  const recipeDirections = await input_cleaner.string_cleaning(req.body.recipeDirections)
  const ingredientNamesArray = req.body.ingredientName
  const ingredientQtyArray = req.body.IngredientQty
  const ingredientMeasurementArray = req.body.IngredientMeasurement
  const recipeSharable = req.body.recipeShareable
  const ingredientIds = req.body.ingredientId
  const newIngredientNameArray = req.body.newIngredientName
  const newIngredientQtyArray = req.body.newIngredientQty
  const newIngredientMeasurementArray = req.body.newIngredientMeasurement
  const pantryId = req.user.pantry_id

  //Update recipe directions if provided
  if (recipeDirections != '') {
    let replaceNewLine = ''
    for (char in recipeDirections) {
      replaceNewLine = replaceNewLine.concat(
        recipeDirections[char].replace('\r', '').replace('\n', '#')
      )
    }

    recipe_t.update({
        recipe_directions: replaceNewLine
      },
      { where: 
        { recipe_id: recipeId,
          pantry_id:pantryId 
        }
    }).catch(function(err) {
      console.log(err)
    })
  }

  //Update recipe name and serving size
  await recipe_t.update({
      recipe_name: recipeName,
      num_people_it_feeds: recipeSize,
      sharable: recipeSharable
    },
    {
      where: { 
        recipe_id: recipeId,
        pantry_id: pantryId  
      }
    }
  )

  //Update all ingredients that have already been assigned to the recipe being edited
  for (ingredient in ingredientIds){
    //Update amount and unit of measurement in ingredients_in_a_recipe table
    IiR_t.update({
      amount_of_ingredient_needed: ingredientQtyArray[ingredient],
      ingredient_unit_of_measurement:ingredientMeasurementArray[ingredient]
    },
    {
      where:{
        ingredient_id:ingredientIds[ingredient]
      }
    })

    //Update ingredient names in ingredients table
    ingredient_t.update({
      ingredient_name:ingredientNamesArray[ingredient]
    },
    {
    where:{
      ingredient_id:ingredientIds[ingredient]
    }
    })
  }
  //Check if multiple ingredients ahve ben
  if (newIngredientNameArray.constructor === Array){
    //Add new ingredients which are added to the recipe which is being edited
    for (newIngredient in newIngredientNameArray){
      await ingredient_t.create({
          ingredient_name: newIngredientNameArray[newIngredient],
          ingredient_weight: 1,
          ingredient_image_path: '../images/placeholder.jpg'
        })
        .then(async function(results) {
          // Get id of newly created ingredient
          createdIngredientsId = results.ingredient_id
          // Link new ingredient to recipe that is being edited
          await IiR_t.create({
            recipe_id: recipeId,
            ingredient_id: createdIngredientsId,
            pantry_id: pantryId,
            amount_of_ingredient_needed: newIngredientQtyArray[newIngredient],
            ingredient_unit_of_measurement: newIngredientMeasurementArray[newIngredient]
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
  //If only 1 ingredients has been added
  else{
    await ingredient_t.create({
      ingredient_name: newIngredientNameArray,
      ingredient_weight: 1,
      ingredient_image_path: '../images/placeholder.jpg'
    })
    .then(async function(results) {
      // Get id of newly created ingredient
      createdIngredientsId = results.ingredient_id
      // Link new ingredient to recipe that is being edited
      await IiR_t.create({
        recipe_id: recipeId,
        ingredient_id: createdIngredientsId,
        pantry_id: pantryId,
        amount_of_ingredient_needed: newIngredientQtyArray,
        ingredient_unit_of_measurement: newIngredientMeasurementArray
      })
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  res.redirect('/recipes/showall')
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

router.delete('/remove/:id', async function(req, res) {
  const recipe = req.params.id
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

module.exports = router
