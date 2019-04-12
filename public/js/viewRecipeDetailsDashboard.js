// CREATED BY OSKARS DAUKSTS
// This file contains logic for viewing recipe details
// These details are shown once user clicks View button on the dashboard

$(document).on('click', '#showRecipeDetails', async function() {
  // set all HTML to nothing to start fresh
  $('#recipeStepsOverlay').html('')
  $('tbody').html('')
  // Get recipe name
  $recipeName = $(this)
    .closest('.card')
    .find('h4')
    .text()
  // Get recipe steps and load them into array as objects
  var recipeStepsArray = $(this)
    .closest('.card')
    .find('.recipeStep')
    .toArray()
  // Get recipe ID
  var recipeId = $(this)
    .closest('.card')
    .attr('recipe-id')

  $('h5').text($recipeName)
  for (step in recipeStepsArray) {
    $('#recipeStepsOverlay').append(
      `<p style="color:#570573">${recipeStepsArray[step].innerText}</p>`
    )
  }
  // Get ingredients required for recipe and current available amount
  var ingredientsRequired = await findRecipeIngredients(recipeId)

  // Build table body
  $.each(ingredientsRequired, function(index, item) {
    // by default all ingredient rows are green
    var ingredientStatus = '<tr style="background-color:#91c02e";>'
    // if available amount of ingredient is less than required amount of ingredient
    if (item.ingredient_amount_required > item.ingredient_sum) {
      // make entire row red
      ingredientStatus = `<tr data-id=${item.ingredient_id} style="background-color:#f2d43b">`
    }
    var $tr = $(ingredientStatus).append(
      $('<td id="ingredient_name" style="color:white;">').text(item.ingredient_name),
      $('<td id="ingredient_amount_required" style="color:white;">').text(
        item.ingredient_amount_required + ' ' + item.ingredient_unit_of_measurement
      ),
      $('<td id="ingredient_amount_available" style="color:white;">').text(
        item.ingredient_sum + ' ' + item.ingredient_unit_of_measurement
      )
    )
    // if available amount of ingredient is less than required amount of ingredient
    if (item.ingredient_amount_required > item.ingredient_sum) {
      $tr.append(
        $('<td style="background-color:white; border:none;">').append(
          $(
            '<button style=background:none; class="btn dp-btn-primary" id="add-missing-ingredient-btn" type="button">'
          ).text('Add Missing Ingredient')
        )
      )
    } else {
      $tr.append('<td style="background-color:white; border:none;">')
    }
    $tr.appendTo('tbody')
  })
})

// Finds ingredients in recipe with the amount currently available
function findRecipeIngredients(recipeId) {
  var found = false
  var ingredientsRequired
  // Parse through entire JSON object that was passed in from the route. In this case all ingredients
  $.each(allData, function(index, item) {
    // In each ingredient parse through all recipes that can be cooked with it
    $.each(item.recipe_data, function getIngredients(index, thing) {
      if (recipeId == thing.recipe_id) {
        var ingredientOnHand = thing.ingredients_required
        ingredientsRequired = thing.ingredients_on_hand
        $.each(ingredientOnHand, function(index, single) {
          // add new json entry for ingredient amount required, in order to cook the recipe
          ingredientsRequired[index]['ingredient_amount_required'] =
            single.amount_of_ingredient_needed
        })
        found = true
        return false
      }
    })
    if (found) {
      return false
    }
  })
  return ingredientsRequired
}

$(document).on('click', '#add-missing-ingredient-btn', function() {
  // var $row = $(this).closest('tr').find('#ingredient_amount_available').text()
  var $ingredientAmountAvailable = $(this)
    .closest('tr')
    .find('#ingredient_amount_available')
  $ingredientAmountAvailable.attr('contenteditable', 'true')
  $ingredientAmountAvailable.focus()
})

//Once user changes the number of ingredient available trigger this
$(document).on('focusout', '#ingredient_amount_available', function() {
  ingredientId = $(this)
    .closest('tr')
    .attr('data-id')
  // Set ingredient table cell to not editable
  $(this)
    .closest('tr')
    .find('#ingredient_amount_available')
    .attr('contenteditable', 'false')
  // Get new ingredient amount
  var ingredientAmountAvailableString = $(this)
    .closest('tr')
    .find('#ingredient_amount_available')
    .text()
  // Get amount required
  var ingredientAmountRequiredString = $(this)
    .closest('tr')
    .find('#ingredient_amount_required')
    .text()
  // Extract digit from new ingredient amount
  var ingredientAmountAvailableDigit = ingredientAmountAvailableString.match(/\d+/)
  // Extract digit from ingredient amount required
  ingredientAmountRequiredDigit = ingredientAmountRequiredString.match(/\d+/)
  if (parseInt(ingredientAmountAvailableDigit) >= parseInt(ingredientAmountRequiredDigit)) {
    $(this)
      .closest('tr')
      .css('background-color', '#d5f5ee')
    $(this)
      .closest('tr')
      .find('button')
      .remove()
  }
  // // Update ingredient amount in database using ajax
  $.ajax({
    type: 'POST',
    url: '/ingredients/editIngredientAmount',
    data: {
      ingredient_amount: parseInt(ingredientAmountAvailableDigit, 10),
      ingredient_id: ingredientId
    },
    success: function() {},
    error: function(err) {
      console.log(err)
    }
  })
})
