// CREATED BY OSKARS DAUKSTS
// THIS FILE HAS ALL THE JQUERY AND AJAX CALLS

// DELETE ingredient request
// On document ready start
$(document).ready(function () {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-ingredient').on('click', function (e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')
    const ex = $target.attr('data-ex')
    const unit = $target.attr('data-unit')
    const qty = $target.attr('data-qty')

    console.log(id + '|' + ex + '|' + unit + '|' + qty)
    // Start AJAX
    $.ajax({
      type: 'DELETE',
      // This route is defined under ingredients.js
      url: '/ingredients/remove/',
      data: {
        id: id,
        ex: ex,
        unit: unit,
        qty: qty
      },
      success: function (response) {
        // route user back to results
        location.reload()
      },
      error: function (err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// DELETE recipe request
// On document ready start
$(document).ready(function () {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-recipe').on('click', function (e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')

    // Start AJAX
    $.ajax({
      type: 'DELETE',
      // This route is defined under ingredients.js
      url: '/recipes/remove/' + id,
      success: function (response) {
        // route user back to results
        // window.location.href = '/recipes/showall'
        location.reload(true)
      },
      error: function (err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// DELETE user
// Triggered by a delete button on admin panel
$(document).ready(function () {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-user').click(function (e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')

    // Start AJAX
    $.ajax({
      type: 'DELETE',
      // This route is defined under ingredients.js
      url: '/users/delete/' + id,
      success: function (response) {
        // route user back to results
        window.location.href = '/users/adminPanel'
      },
      error: function (err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// Delete extra rows if any from add_reipe
$(document).on('click', '.delete-row', function () {
  // delete closest row
  $(this)
    .closest('.form-row')
    .remove()
})

// Delete ingredient inside the edit recipe overlay
$(document).on('click', '.delete-current-ingredient', function () {
  // Get id of the recipe that is being edited
  recipe_id_being_edited = $(this).attr('data-id')
  // Get ingredient name that is being removed
  ingredient_name = $('#ingredient-name').attr('placeholder')
  row = $(this).closest('.form-row')

  $.ajax({
    type: 'DELETE',
    // This route is defined under ingredients.js
    url: '/ingredients/remove/recipe_ingredient/' + ingredient_name,
    // If ingredient has been removed remove the ingredient row
    success: function () {
      row.remove()
    // Remove whole row
    },
    error: function (err) {
      console.log(err)
      console.log('Could not delete: ' + ingredient_name)
    }
  })
})

// This will trigger when user tries to edit a recipe
$('#editRecipe').on('show.bs.modal', function (event) {

  // Button that triggered the display card
  var button = $(event.relatedTarget)
  // Get the recipe row based on the button clicked and its closest tr element
  $recipeRow = button.closest('tr').children()
  // Based on the button click it will get data-target id of the row and find the drop down this ide points to
  $recipeRowDataTarget = $(button.closest('tr').attr('data-target')).children()
  var ingredientList = []
  // for each ingredient that the recipe contains
  for (element in $recipeRowDataTarget) {
    // Do not get 'Ingredients' label
    if (element != 0) {
      // Do not get empty or undefined cells
      if ($recipeRowDataTarget[element].innerText != undefined) {
        // push results into an array
        ingredientList.push($recipeRowDataTarget[element].innerText)
      }
    }
  }
  var values = []
  // For each element in the recipe row array
  for (child in $recipeRow) {
    // for each cell get its index
    var cellIndex = $recipeRow[child].cellIndex
    // Only get RecipeName and ServingSize and RecipeID values based on the cell index of the table
    if (cellIndex == 1 || cellIndex == 3 || cellIndex == 4) {
      values.push($recipeRow[child].innerText)
    }
  }
  // At this point we have
  // Recipe name and serving size
  // Recipe ingredients
  // Populate recipe general information
  // Set header of the overlay form
  $('h4').text('Editing Recipe - ' + values[1])
  $('h4').addClass('data-id')
  $('#recipe-name').val('')
  $('#recipe-size').val('')
  // Set placeholders inside input box with a value of recipe name that it currently has
  $('#recipe-name').attr('placeholder', values[1])
  // $('#recipe-name').attr('name', 'currentName:' + values[0])
  // Set placeholders inside input box with a value of recipe serving size that it currently has
  $('#recipe-size').attr('placeholder', values[2])
  // $('#recipe-size').attr('name', 'currentServSize:' + values[2])
  // Set form html to nothing so it can be updated with new recipe selected
  // This is in case user closes the form overlay and opens it back up
  // Otherwise the form will keep adding rows non stop
  $('#ingredient-rows').html('')
  $('#dynamic-ingredient-row').html('')
  // Populate ingredient rows
  for (ingredient in ingredientList) {
    let ingredientCounter = 'ingredient' + ingredient
    // split Ingredient name and QtyMeasurement
    var ingredientsSplit = ingredientList[ingredient].split(',')
    // get ingredientName
    let ingredientName = ingredientsSplit[0]
    // split measurement and qty into 2 separate fields
    var ingredientQtyAndMeasurement = ingredientsSplit[1].split(' ')
    // get Qty
    let ingredientQty = ingredientQtyAndMeasurement[1]
    // get measurement
    let ingredientMeasurement = ingredientQtyAndMeasurement[2].toLowerCase()
    // Create a row for an ingredient
    $ingredientRow = `
        <div class="form-row">
            <div class="form-group col-4">
                <input class="form-control" name="${ingredientName}" id="ingredient-name" type="text" placeholder="${ingredientName}" />
            </div>
            <div class="form-group col-3">
                <input class="form-control" name="${ingredientName}" id="ingredient-qty" type="text" placeholder="${ingredientQty}" />
            </div>
            <div class="form-group col-4">
                <select name="${ingredientName}" class="form-control id="measurement">
                    <option value="">Measurement</option>
                    <option value="fl oz">fluid ounce</option>
                    <option value="ml">Mililliter</option>
                    <option value="quart">Quart</option>
                    <option value="lb">Pound</option>
                    <option value="oz">Ounce</option>
                    <option value="cup">Cup</option>
                    <option value="tbsp.">Tablespoon</option>
                    <option value="tsp.">Teaspoon</option>
                </select>
            </div>
            <div class="form-group col-1">
                <button type="button" data-id="${values[0]}" class="btn btn-danger delete-current-ingredient">X</button>
            </div>
        </div>`
    // shows what measurement has already been selected for that specific ingredient
    $ingredientRow = $ingredientRow.replace('value="' + ingredientMeasurement + '"', `value ="${ingredientMeasurement}" selected`)
    $('#ingredient-rows').append($ingredientRow)
  }
  var $input = $('<input>').attr('type', 'hidden').attr('name', 'recipeId').val(values[0])
  $('#ingredient-rows').append($input)
})

// Cook it button logic
// Uses ingredients based on the recipe chosen
// Updates dashboard
$(document).ready(function () {
  $('#card-one').on('click', function (e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id value from the button, which is recipe ID
    const id = $target.attr('recipe-id')
    console.log(id)
    // Start AJAX
    $.ajax({
      type: 'GET',
      url: '/users/cook/' + id,
      success: function (response) {
        // Reload the page to update cards
        location.reload()
      },
      error: function (err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// Save community recipe
$(document).on('click', '.saveRecipe', function () {
  // Get id of the community recipe clicked
  $card_id = $(this)
    .closest('.card')
    .attr('id')

  // Send ajax request with recipe ID that is being copied
  $.ajax({
    type: 'POST',
    url: '/users/saveCommunityRecipe',
    data: { community_recipe_id: $card_id },
    success: function (response) {
      // Reload the page to update cards
      location.reload()
    },
    error: function (err) {
      console.log('Could not copy recipe')
    }
  })
})

// When user clicks share recipes while on the community page
// Populate the overlay form with the recipes they already have
$('#shareForm').on('show.bs.modal', function (event) {
  // set overlay form to empty
  $('#recipe-content').html('')
  $.ajax({
    type: 'GET',
    url: '/recipes/getPantryRecipes/',
    success: function (response) {
      // For each recipe in list
      // Add logic not to show recipes that are already shared
      $.each(response, function (index, value) {
        console.log(response)
        recipe_format =
          '<div class="individual-recipe"><div class="media"><img style="width: 30%" class="mr-3" src="$1" alt="Generic placeholder image"><div class="media-body"><h5 class="mt-0">$2</h5>$3</div></div></div><br>'
        // if an image for the recipe does not exist
        if (value.recipe_image_path == null) {
          recipe_format = recipe_format.replace('$1', '/images/placeholder.jpg')
        } else {
          // set image
          recipe_format = recipe_format.replace('$1', value.recipe_image_path)
        }
        // set recipe name
        recipe_format = recipe_format.replace('$2', value.recipe_name)
        // set recipe directions
        recipe_format = recipe_format.replace('$3', value.recipe_directions)
        // add to the page
        $('#recipe-content').append(recipe_format)
      })
    },
    error: function (err) {
      console.log('Could not get recipes')
    }
  })
})

// Share recipe
// Once user selects which recipe to share run this
$(document).on('click', '.individual-recipe', function () {
  // get recipe name that was clicked
  $recipe_name = $(this).find('h5')[0].innerText

  // Send request to API for setting this recipe as sharable recipe
  $.ajax({
    type: 'POST',
    url: '/recipes/share',
    data: { recipe_name: $recipe_name },
    success: function (response) {
      console.log('Recipe: ' + $recipe_name + ' was shared')
      location.reload()
    },
    error: function (err) {
      console.log('Could not share recipe to the community')
    }
  })
})

// Once admin clicks change privillege on admin panel this gets called
$('#changePrivilege').on('show.bs.modal', function (event) {
  $button = $(event.relatedTarget)
  user_id = $button.closest('tr').attr('data-id')

  $(this)
    .find('form')
    .attr('action', '/users/changePrivilege/' + user_id)
})

// Once admin click reset password on admin panel this gets called
$('#resetForm').on('show.bs.modal', function (event) {
  $button = $(event.relatedTarget)
  user_id = $button.closest('tr').attr('data-id')

  $(this)
    .find('form')
    .attr('action', '/users/resetPassword/' + user_id)
})

$('#OpenImgUpload').click(function () {
  $('#imgupload').trigger('click')
})

// Triggered when admin clicks save button on the admin panel for the new name of the pantry
$('#save-pantryName-btn').click(function savePantryName () {
  $newName = $('#name').text()

  // Send request to update pantry name in the database
  $.ajax({
    type: 'POST',
    url: '/pantry/changeName',
    data: { pantryName: $newName },
    success: function () {},
    error: function (err) {
      console.log(err)
    }
  })
})

// Once user clicks on edit link for his password run this function
$('#editEmailButton').click(function showEditField (e) {
  // Stop link from refreshing the page
  e.preventDefault()
  $(this).hide()
  // show input field for a user to enter a new password
  $(
    "<div id='newUsername' class='form-row'><div class='form-group col-md-3'><input name='newUsername' class='form-control' placeholder='New username' required='' ></div></div>"
  ).insertAfter($('#userEmail'))
  // show save button
  $("<button class='btn btn-primary' type='submit' id='saveEmailButton'>Save</button>").insertAfter(
    $('#newUsername')
  )
  // show cancel button
  $("<button class='btn btn-danger' type='button' id='cancelPassEdit'>Cancel</button>").insertAfter(
    $('#saveEmailButton')
  )
})

// Once user clicks cancel password change hide cancel button and show edit button
$(document).on('click', '#cancelPassEdit', function cancelPasswordEdit () {
  console.log('CLICK')
  // hide cancel button after its clicked
  $(this).hide()
  // show edit button
  $('#editEmailButton').show()
  // hide new password field input
  $('#newUsername').hide()
  // hide save email button
  $('#saveEmailButton').hide()
})

$('#sortByTimeFrameBtn').click(function sortByTimeFrame () {
  $timeFrameValue = $('input[data-slider-value]').val()
  $.ajax({
    type: 'POST',
    url: '/pantry/setExpirationTimeFrame',
    data: { expirationTimeFrameValue: $timeFrameValue },
    success: function () {},
    error: function (err) {
      console.log(err)
    }
  })
})
