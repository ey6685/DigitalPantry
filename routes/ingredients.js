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
const gm = require('gm')
const multer = require('multer')
const fs = require('fs')
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
  ////////////////////////////////
  // need to add pantry id feching//
  /////////////////////////////////
  db.query(
    'select ingredients.ingredient_image_path, ingredients.ingredient_id, ingredients.ingredient_name, ingredients.priority, ingredients_in_pantry.ingredient_amount, ingredients_in_pantry.ingredient_unit_of_measurement, ingredients_in_pantry.ingredient_expiration_date from ingredients_in_pantry inner join ingredients on ingredients_in_pantry.ingredient_id = ingredients.ingredient_id and ingredients_in_pantry.ingredient_expiration_date is not null AND ingredient_expiration_date >= CURDATE() and pantry_id=' +
      currentPantryId.pantry_id +
      ';',
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

// POST request to localhost:3000/ingredients/add
// This will add a new ingredient to available ingredients and update database
// Created by Jon
// Last modified: 03/17/2019
// Modified by: Jon
// Modification:
//  Updated route to use new DB tables and variables names
//  Updated route to use Sequelize instead of raw SQL
router.post('/showall', async function(req, res) {
  // get parameters from request body
  console.log(req.body)
  const currentUserId = req.session.passport['user']

  var ingredient_name = req.body.ingredient_name
  var ingredient_amount = req.body.ingredient_total
  var ingredient_unit = req.body.ingredient_measurement
  var ingredient_date = req.body.ingredient_expiration_date
  var ingredient_priority = req.body.priority
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
  //check the ingredients are in the pantry
  var in_inv = await ing_in_stock.findOne({
    where:{
      ingredient_id: final_id,
      ingredient_expiration_date: ingredient_date,
      pantry_id: currentUserId
    }
  })

  //if it is alread there then just add to that entry
  if(in_inv.length >0){
    var final_amount
    final_amount = in_inv.ingredient_amount + await UC.converter_raw(ingredient_amount,ingredient_unit,in_inv.ingredient_unit_of_measurement);
    final_amount = await parseFloat(parseFloat(final_amount).toFixed(2))

    ing_in_stock.update({ingredient_amount: final_amount},
      {
        where:{
          ingredient_id: final_id,
          ingredient_expiration_date: ingredient_date,
          ingredient_unit_of_measurement: ingredient_unit
        }
      })
  }

  //if it not in our STOCk then add it to the list
  else{
  }
  var new_inv = ing_in_stock.create({
    pantry_id: 1, //change to get this from the sesson
    ingredient_id: final_id,
    ingredient_amount: ingredient_amount,
    ingredient_unit_of_measurement: ingredient_unit,
    ingredient_expiration_date: ingredient_date
  })

  console.log('ingredient add: \n' + JSON.stringify(new_inv))

  res.redirect('/ingredients/showall')
})

// Render page with data from database
// GET request to localhost:3000/users/login
router.get('/expired', function(req, res) {
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

  var currentUserId = req.session.passport['user']
  var PantryId = await User.findOne({
    attributes: ['pantry_id'],
    where:{
      user_id: currentUserId
    }
  })
  var currentPantryId = PantryId.pantry_id
  var imagePath = new Array()
  var imagePathSys = new Array()
  console.log(req.body.ingredientProperties)
  console.log(req.body.ingredientProperties.length)
  ///needs testing
  ///patrick gets a windows error
  for(var i = 0 ; i<req.files.length; i++){
    imagePathSys.push(req.files[i].path)
    
  }
  try{
    for (var i =0; i < imagePathSys.length;i++) {

      console.log("system image path: "+ imagePathSys[i])
      //rename
      const currentDate = Date().now
      console.log(currentDate)
      imagePath.push(currentDate + "jpg")
     var writing= await gm(imagePathSys[i]).resize(1024,575,'!').write(imagePathSys[i],err =>{
       if(err){
         imagePath[i] = imagePath[i-1] = 'placeholder.jpg'
        }
        fs.renameSync(imagePathSys[i], "./public/images/" + currentDate + "jpg")
       
     }) 
    
     console.log("imagepath:")
     console.log("----------")
     console.log(imagePath)    // if (req.files) {
    //   console.log("the file data")
    //   console.log("==============")
    //   console.log(req.files[i-1])
    //   console.log(req.files.length)
    //   console.log('File Uploaded Successfully')
    //   var e 
    //     try{
    //     var currentDate = Date.now()
    //     imagePath[i-1] = currentDate  + '.jpg'
        
    //       e = false
    //       console.log(i + " " )
    //       console.log("pic magic " + req.files[i-1].path)
    //       console.log("===========================")
    //     await gm(req.files[i-1].path) // uses graphicsmagic and takes in image path
    //       .resize(1024, 576, '!') // Sets custom weidth and height, and ! makes it ignore aspect ratio, thus changing it. Then overwrites the origional file.
    //       .write(req.files[i-1].path, err => {
    //         fs.rename(req.files[i-1].path, './public/images/' + currentDate + '.jpg', function(err) {
    //           if (err) throw err
    //           console.log('File Renamed.')
    //           fs.close(req.files[i-1].path)
    //         })

    //         if (err) {
    //           console.log(err)
    //           imagePath[i-1] = 'placeholder.jpg'
    //         }
    //       })
        
    //   }
    //     catch(e){
    //       imagePath[i-1] = 'placeholder.jpg'
    //     }
      
    //   }
    //   else {
        
    //       imagePath[i-1] = 'placeholder.jpg'
    //       console.log('File Upload Failed')
    //     }
      //////////////////////////////////////
      
      
    console.log(req.body.ingredientProperties[i])
    
      var block_oF_data = req.body.ingredientProperties[i];
      if(block_oF_data != null){
        console.log(block_oF_data)
        console.log("i is " + i)
        console.log('0 is ' + block_oF_data[0])
        console.log('1 is ' + block_oF_data[1])
        console.log('2 is ' + block_oF_data[2])
        console.log('3 is ' + block_oF_data[3])
        console.log('4 is ' + block_oF_data[4])
        console.log("path: " + imagePath[i-1])
        //seperate the data
        var ingredient_name = block_oF_data[0]
        var ingredient_amount = block_oF_data[1]
        var ingredient_unit = block_oF_data[2]
        var ingredient_date = block_oF_data[3]
        var priority = block_oF_data[4]
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
            ingredient_weight: new_weight,
            ingredient_image_path: '/images/' + imagePath[i-1],
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
            pantry_id: 1, //change to get this from the sesson
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
  const currentUserId = req.session.passport['user']
  currentPantryId = await User.findOne({
    where: { user_id: currentUserId }
  })
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
})

router.post('/edit', async function editIngredientInfo(req, res){
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

// remove ingredient by name
router.delete('/remove/recipe_ingredient/:name', async function deleteIngredientByName(req, res) {
  const ingredientName = req.params.name
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
