/*
This file is supposed to suggest recipe to cook based on the expired ingredient, but Patrick made a simplified version of this 
*/

const express = require('express')
const router = express.Router()
const async = require('async')

router.get('/', function (req, res) {
  global.recipeName = []
  var init = getExpiringIngredients()
  init
    .then(
      function (results) {
        var ingredientsSortedByExpirationDate = results
        return ingredientsSortedByExpirationDate
      },
      function (err) {
        console.log(err)
      }
  )
    .then(function (ingredientsSorted) {
      var something = 0
      async.forEach(ingredientsSorted, function (item, callback) {
        var ingredient_total = item.recipe_ingredient_qty
        var ingredientID = item.ingredient_id
        var test = getRecipeBasedOnIngredient(ingredientID)
        test
          .then(
            function (results) {
              var recipe = results
              return recipe
            },
            function (err) {
              console.log(err)
            }
        )
          .then(function (results) {
            var recipeID = results[0]['recipe_id']
            var recipePromise = getIdsOfIngredientsForSingleRecipe(results[0]['recipe_id'])
            recipePromise.then(
              function (results) {
                var ingredientsIDs = results
                var canMakeRecipe = true
                console.log('BEFORE GLOBAL')
                var checkedRecipes = []
                if (!checkedRecipes.includes(recipeID)) {
                  for (var ingredient in ingredientsIDs) {
                    if (ingredient_total < ingredientsIDs[ingredient]['recipe_ingredient_qty']) {
                      console.log("Sorry can't make this recipe")
                      canMakeRecipe = false
                    }
                  }
                  checkedRecipes.push(recipeID)
                  if (canMakeRecipe) {
                    var findRecipePromise = findRecipeNameByID(ingredientID)
                    findRecipePromise.then(function (results) {
                      if (typeof results[0] !== 'undefined') {
                        recipeName.push(results[0]['recipe_name'].toString())
                        console.log('Global:' + recipeName)
                        console.log('You can make: ' + results[0]['recipe_name'].toString())
                      }
                    })
                  }
                }
                // Tells async.forEach to continue with next ingredient in the sorted list
                callback()
              },
              function (err) {
                console.log(err)
              }
            )
          })
      // }
      })
      res.send(recipeName)
    })
})

function getExpiringIngredients () {
  return new Promise((resolve, reject) => {
    var query =
    'SELECT ingredient_id,ingredient_total,DATE(ingredient_expiration_date) as date FROM ingredients ORDER BY ingredient_expiration_date ASC'
    db.query(query, function (err, results) {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function findRecipeNameByID (recipeIdOfExpiringIngredient) {
  return new Promise((resolve, reject) => {
    query = 'SELECT recipe_name FROM recipes WHERE recipe_id=' + recipeIdOfExpiringIngredient
    db.query(query, function (err, results) {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function getIdsOfIngredientsForSingleRecipe (recipeIdOfExpiringIngredient) {
  return new Promise((resolve, reject) => {
    query =
      'SELECT ingredient_id,recipe_ingredient_qty FROM recipe_ingredient WHERE recipe_id=' +
      recipeIdOfExpiringIngredient
    db.query(query, function (err, results) {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function getRecipeBasedOnIngredient (ingredientID) {
  return new Promise((resolve, reject) => {
    query = 'SELECT recipe_id FROM recipe_ingredient WHERE ingredient_id=' + ingredientID
    db.query(query, function (err, results) {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

module.exports = router
