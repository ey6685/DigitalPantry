const express = require('express')
const router = express.Router()
const moment = require('moment')
const ingredientInRecipe = require('../DB_models/ingredients_in_a_recipe')
const ingredient_t = require('../DB_models/Ingredients')
const ing_in_stock = require('../DB_models/ingredients_in_pantry')
const pantry_table = require('../DB_models/Pantry')
const aw = require('../algorithm/auto_weight')
const User = require('../DB_models/Users')
const op = require('sequelize').Op
const input_cleaner = require('../functions/Input_cleaner')
const val = require("validator")
// const gm = require('gm')
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});
const multer = require('multer')
// const fs = require('fs')
const UC = require('../algorithm/Convert_unts');
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

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/showall', async function(req, res) {
  // renders showall_recipes with all the available ingredients
  const currentUserId = req.session.passport['user']
  var currentPantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: {
      user_id: currentUserId
    }
  })
  //inner join to grab all the data we need for the page
  db.query(
    'select ingredients.ingredient_image_path, ingredients.ingredient_id, ingredients.ingredient_name, ingredients.priority, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id and ingredients_in_pantry.ingredient_expiration_date is not null AND ingredient_expiration_date >= CURDATE() and pantry_id=' +
      currentPantryId.pantry_id +
      ';',
    function(err, results) {
      for (key in results) {
        //convert it to a normal looking date for normal people
        results[key]['ingredient_expiration_date'] = moment(
          results[key]['ingredient_expiration_date']
        ).format('LL')
      }
      if (err) throw err
      //render page
      res.render('showall_ingredients', {
        title: 'Your Ingredients',
        results: results
      })
    }
  )
})


// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/expired', function(req, res) {
  //grab pantry id
  userPantryId =req.user.pantry_id
  // renders showall_recipes with all the available ingredients
  const query = `
  SELECT ingredients.ingredient_image_path, ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date 
  FROM ingredients_in_pantry 
  INNER JOIN ingredients 
  ON ingredients_in_pantry.ingredient_id = ingredients.ingredient_id AND ingredients_in_pantry.ingredient_expiration_date IS NOT NULL AND ingredient_expiration_date < CURDATE()
  WHERE pantry_id=${userPantryId};`
  db.query(
    query,
    function(err, results) {
      for (key in results) {
        //change the dates to normal looking ones
        results[key]['ingredient_expiration_date'] = moment(
          results[key]['ingredient_expiration_date']
        ).format('LL')
      }
      if (err) throw err
      //rend page
      res.render('expired_ingredients_np', {
        title: 'Your Expired Ingredients',
        results: results
      })
    }
  )
})

// Render page with a form for adding a new ingredient
// GET request to localhost:3000/ingredients/add
router.get('/add', function(req, res) {
  res.render('add_ingredient', {
    title: 'Add Ingredients'
  })
})

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/expiredAdmin', function expiredTable(req, res) {
  userPantryId =req.user.pantry_id
  // renders showall_recipes with all the available ingredients
  const query = `
  SELECT ingredients.ingredient_image_path, ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date 
  FROM ingredients_in_pantry 
  INNER JOIN ingredients 
  ON ingredients_in_pantry.ingredient_id = ingredients.ingredient_id AND ingredients_in_pantry.ingredient_expiration_date IS NOT NULL AND ingredient_expiration_date < CURDATE()
  WHERE pantry_id=${userPantryId};`

  db.query(
    query,
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
router.post('/add', upload.array('image'), async function addIngredient(req, res) {
  console.log("++++++++++++++++++++++++++++++++")
  console.log("adding ingredients");
  //grab pantry id
  var userPantryId =req.user.pantry_id
  var currentPantryId = PantryId.pantry_id
  var imagePath = new Array()
  var imagePathSys = new Array()
  console.log(req.body.ingredientProperties)
  console.log(req.body.ingredientProperties.length)

  for(var i = 0 ; i<req.files.length; i++){
    imagePathSys.push(req.files[i].path)
    
  }
  try{
    //start a loop for all the elements on the page
    //page sends the data starting at 1
    for (var i =1; i < req.body.ingredientProperties.length;i++) {
      if(imagePathSys[i-1])
      {
        console.log("system image path: "+ imagePathSys[i-1])
        //the old path is the full path to the image on the computer
        const old_path = imagePathSys[i-1];
        //making the image name/path for storing onthe sever
        var currentDate =  Date.now()
        const new_path = "./public/images/" + currentDate + ".jpg"
        //this path is forthe db
        var no_dot = "/images/" + currentDate + ".jpg"
        
        console.log("new_path: " + new_path )
        
        imagePath.push(no_dot)
      var writing= await gm(old_path).resize(1024,575,'!').write(old_path,err =>{
        if(err){
          //if an error occurs in writing the pic to the sever set the path to the image 
          //to the placehold so an image shows ups
          console.log(err)
          imagePath[i] = '/images/placeholder.jpg'
          }
          console.log("in function sys path: " + old_path)
          console.log("in function new path:" +new_path)
          //write to the sever
          fs.renameSync(old_path, new_path)
          
        
      }) 
      
      console.log("imagepath:")
      console.log("----------")
      console.log(imagePath)  
    
      }  
      //show the ingredients properties array
    console.log(req.body.ingredientProperties[i])
      //take a slot out of it
      var block_oF_data = req.body.ingredientProperties[i];
      //if the user didnt delete the row onthe page
      if(block_oF_data != null)
      {
        console.log(block_oF_data)
        console.log("i is " + i)
        console.log('0 is ' + block_oF_data[0])
        console.log('1 is ' + block_oF_data[1])
        console.log('2 is ' + block_oF_data[2])
        console.log('3 is ' + block_oF_data[3])
        console.log('4 is ' + block_oF_data[4])
        console.log("path: " + imagePath[i-1])
        //seperate and clean the data the data
        var ingredient_name =  await input_cleaner.string_cleaning(block_oF_data[0])
        var ingredient_amount = await input_cleaner.num(block_oF_data[1])
        var ingredient_unit = await block_oF_data[2]
        var ingredient_date = await input_cleaner.string_cleaning(block_oF_data[3])
        var priority = await input_cleaner.string_cleaning(block_oF_data[4])
        var final_id
        //check db if the ingredient exists
        var does_ingredient_exist = await ingredient_t.findOne({
          where: {
            ingredient_name: ingredient_name
          }
        })

        //if it does exist then grab the id
        if (does_ingredient_exist != null) {
          final_id = does_ingredient_exist.ingredient_id
        } else {
          //if it does NOT exist then create a new row in the ingredietns table
          var new_weight = await aw.auto_weight(ingredient_name)
          var new_ingredient = await ingredient_t.create({
            ingredient_name: ingredient_name,
            ingredient_weight: new_weight,
            ingredient_image_path: imagePath[i-1],
            priority: priority
          })
          final_id = new_ingredient.ingredient_id
        }
        //check the ingredients are in the pantry's stock
        var in_inv = await ing_in_stock.findOne({
          where:{
            ingredient_id: final_id,
            ingredient_expiration_date: ingredient_date,
            pantry_id: currentPantryId
          }
        })
        console.log("in inv:")
        console.log("=======")
        console.log(JSON.stringify(in_inv))
        //if it is just add it to the currert entry
        if(in_inv != null){
          var final_amount
          final_amount = in_inv.ingredient_amount + await parseFloat(UC.converter_raw(ingredient_amount,ingredient_unit,in_inv.ingredient_unit_of_measurement));
          final_amount = await parseFloat(parseFloat(final_amount).toFixed(2))
          var query = `update ingredients_in_pantry set ingredient_amount = ${final_amount} where ingredient_id = ${final_id} and pantry_id =${currentPantryId} and ingredient_expiration_date = '${ingredient_date}';`
          console.log("query")
          console.log(query);
          db.query(query,results =>{
            console.log("database updated")
          })
        }
        else{
          //just add a new entry
          var new_inv = await ing_in_stock.create({
            pantry_id: currentPantryId, 
            ingredient_id: final_id,
            ingredient_amount: ingredient_amount,
            ingredient_unit_of_measurement: ingredient_unit,
            ingredient_expiration_date: ingredient_date,
            priority: priority
          })
          console.log('ingredient add:')
          console.log("===============")
          console.log(JSON.stringify(new_inv))
        }
        
          }
        }
      }
      catch(e){
        console.log(e)
      }
    // }
    
  console.log("++++++++++++++++++++++++++++++++")
  res.redirect('/ingredients/showall')
})

// Render page with data from database
// GET request to localhost:3000/ingredients/cards
router.get('/cards', function showCards(req, res) {
  userPantryId =req.user.pantry_id
  const query =
    `SELECT ingredients.ingredient_image_path, ingredients.priority, ingredients.ingredient_id, ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date 
    FROM ingredients_in_pantry 
    INNER JOIN ingredients 
    ON ingredients_in_pantry.ingredient_id = ingredients.ingredient_id AND ingredients_in_pantry.ingredient_expiration_date IS NOT NULL AND ingredient_expiration_date >= CURDATE() 
    WHERE pantry_id=${userPantryId};`
  db.query(query, function getResults(err, results) {
    for (key in results) {
      results[key]['ingredient_expiration_date'] = moment(
        results[key]['ingredient_expiration_date']
      ).format('LL')
    }
    if (err) throw err
    // console.log("the query results: \n" + JSON.stringify(results));
    res.render('showall_ingredients_cards', {
      title: 'Your Ingredients',
      results: results
    })
  })
})

//This gets ingredients with same name, because users can add same ingredients with different measurements
router.get('/ingredientsWithSameName/:id', function showCards(req, res) {
  ingredientId = req.params.id
  query = `SELECT ingredients.ingredient_name, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date 
  FROM ingredients_in_pantry 
  INNER JOIN ingredients ON ingredients_in_pantry.ingredient_id = ${ingredientId} AND ingredients.ingredient_id = ${ingredientId};`
  db.query(query, function(err, results){
    if (err){
      console.log(err)
      throw err
    }
    res.json(results)
  })
})

// This route gets called from dashboard when users change ingredient amount on-hand
router.post('/editIngredientAmount', async function editIngredientAmount(req, res) {
  //grab user and pantry id
  const currentUserId = req.session.passport['user']
  currentPantryId = await User.findOne({
    where: { user_id: currentUserId }
  })
  //make sure they are numebrs
  if(val.isNumeric(req.body.ingredient_id) && val.isNumeric(req.body.ingredient_amount))
  {
  const ingredientId = req.body.ingredient_id
  const newAmount = req.body.ingredient_amount
  await ing_in_stock.update(
    {
      ingredient_amount: newAmount
    },
    { where: { ingredient_id: ingredientId, pantry_id: currentPantryId.pantry_id } }
  )

  console.log("DONE!")
  res.send('success')
  }
  else
    res.send("error")
})

router.post('/edit',upload.single('image'),async function editIngredientInfo(req, res){
  //Upload image
  var imagePath
  // If image file exists
  if (req.file) {
    console.log('File Uploaded Successfully')
    var currentDate= Date.now()
    var imagePath = ""
    var databaseImagePath = ""
    try{
      databaseImagePath = `/images/${currentDate}.jpg`
      imagePath = `./public` + databaseImagePath
      gm(req.file.path) // uses graphicsmagic and takes in image path
      .resize(1024, 576, '!') // Sets custom weidth and height, and ! makes it ignore aspect ratio, thus changing it. Then overwrites the origional file.
      .write(req.file.path, err => {
        fs.rename(req.file.path, imagePath, function (err) {
          if (err) throw err;
          console.log('File Renamed.');
        })
        if (err) {
          console.log(err)
        }
      })
    }
    catch(err){
      console.log("Could not resize")
      console.log(err)
    }
    await ingredient_t.update({
      ingredient_image_path:databaseImagePath
    },
    {
      where:{
        ingredient_id:req.body.ingredientId
      }
    })
  }
  //make new ingredient object 
  ingredientData = new Object()
  ingredientData.ingredientNewExpirationDate = req.body.ingredientDate
  ingredientData.ingredientCurrentExpirationDate = await moment(new Date(req.body.ingredientCurrentExpirationDate)).format('YYYY-MM-DD')
  ingredientData.ingredientId = parseInt(req.body.ingredientId)
  ingredientData.ingredientName = req.body.ingredientName
  ingredientData.ingredientTotal = req.body.ingredientTotal
  ingredientData.ingredientMeasurement = req.body.ingredientMeasurement
  ingredientData.ingredientDate = req.body.ingredientDate
  ingredientData.ingredientPriority = req.body.ingredientPriority

  //If name was updated update ingredients table since this table has all ingredients names
  if(ingredientData.ingredientName != ""){
    await ingredient_t.update({
      ingredient_name:ingredientData.ingredientName,
      priority:ingredientData.ingredientPriority
    },
    {
      where:{
        ingredient_id:ingredientData.ingredientId
      }
    })
  }
  //query start
  query = "UPDATE ingredients_in_pantry SET "
  //If ingredient total has been updated append to query
  if(ingredientData.ingredientTotal != ""){
    console.log("Ingredient TOTAL is not empty")
    query = query + `ingredient_amount=${ingredientData.ingredientTotal},`
  }
  //If new expiration date does not match the old expiration date append to query
  if(ingredientData.ingredientNewExpirationDate !== ingredientData.ingredientCurrentExpirationDate){
    console.log("Ingredient EXPIRATION DATE do not match")
    query = query + `ingredient_expiration_date='${ingredientData.ingredientNewExpirationDate}',`
  }
  //Add last cell to update
  query = query + `ingredient_unit_of_measurement='${ingredientData.ingredientMeasurement}' `
  //End the query building
  query = query + `WHERE ingredient_id=${ingredientData.ingredientId} AND ingredient_expiration_date='${ingredientData.ingredientCurrentExpirationDate}';`
  db.query(query,function(err, results){
    if(err){
      throw err
    }
    res.redirect("/ingredients/showall")
  })
})

// remove ingredient by id
router.delete('/remove/', async function remove(req, res) {
  const ingredient = req.body.id
  let expirationDate = req.body.ex
  const unit = req.body.unit
  const qty = req.body.qty
  expirationDate = await new Date(expirationDate)
  expirationDate = await moment(expirationDate).format('YYYY-MM-DD')
  await ing_in_stock.destroy({
    where: {
      ingredient_id: ingredient,
      ingredient_expiration_date: expirationDate,
      ingredient_unit_of_measurement: unit,
      ingredient_amount: qty
    }
  }).catch(function handleError(error){
    console.log(error)
  })
  res.send('success')
})

router.get('/ingredientsForRecipe/:id', async function(req, res){
  recipeId = req.params.id
  query = `SELECT ingredients.ingredient_id, ingredients.ingredient_name, ingredients.ingredient_image_path, ingredients_in_a_recipe.amount_of_ingredient_needed, ingredients_in_a_recipe.ingredient_unit_of_measurement
  FROM ingredients_in_a_recipe
  INNER JOIN ingredients
  ON ingredients_in_a_recipe.recipe_id=${recipeId} AND ingredients.ingredient_id=ingredients_in_a_recipe.ingredient_id;`
  await db.query(query, function(err, results){
    if (err){
      throw err
    }
    res.json(results)
  })
})

// remove ingredient by name
router.delete('/remove/recipe_ingredient/:name', async function deleteIngredientByName(req, res) {
  const ingredientName = await input_cleaner.string_cleaning(req.params.name)
  const recipeId = req.body.recipe_id
  // Get ingredient ID which is beaing udpated
  const ingredientId = await ingredient_t.findOne({
    attributes: ['ingredient_id'],
    where: {
      ingredient_name: ingredientName
    }
  })
  ingredientInRecipe.destroy({
    where: {
      ingredient_id: ingredientId.ingredient_id,
      recipe_id: recipeId
    }
  })

  res.send('Success')
})

module.exports = router
