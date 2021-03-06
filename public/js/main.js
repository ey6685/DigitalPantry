// CREATED BY OSKARS DAUKSTS
// THIS FILE HAS ALL THE JQUERY AND AJAX CALLS FOR DIFFERENT PAGES

// DELETE ingredient request
// On document ready start
$(document).ready(function() {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-ingredient').on('click', function(e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')
    // get ingredient expiration date
    const ex = $target.attr('data-ex')
    // get ingredient measurement
    const unit = $target.attr('data-unit')
    // get ingredient quantity
    const qty = $target.attr('data-qty')

    // Send request
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
      success: function(response) {
        // reload page with new data
        location.reload()
      },
      error: function(err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// DELETE recipe request
// On document ready start
$(document).ready(function(e) {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-recipe').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')

    // Start AJAX
    $.ajax({
      type: 'DELETE',
      // This route is defined under ingredients.js
      url: '/recipes/remove/' + id,
      success: function(response) {
        // route user back to results
        // window.location.href = '/recipes/showall'
        location.reload(true)
      },
      error: function(err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// DELETE user
// Triggered by a delete button on admin panel
$(document).ready(function() {
  // Once DELETE button is clicked on showall_ingredients.pug trigger
  $('.delete-user').click(function(e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id from the button
    const id = $target.attr('data-id')

    // Start AJAX
    $.ajax({
      type: 'DELETE',
      // This route is defined under ingredients.js
      url: '/users/delete/' + id,
      success: function(response) {
        // route user back to results
        window.location.href = '/users/adminPanel'
      },
      error: function(err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})

// Delete extra rows if any from add_reipe
$(document).on('click', '.delete-row', function() {
  // delete closest row
  $(this)
    .closest('.form-row')
    .remove()
})

// Delete ingredient inside the edit recipe overlay
$(document).on('click', '.delete-current-ingredient', function() {
  // Get id of the recipe that is being edited
  recipe_id_being_edited = $(this).attr('data-id')
  // Get ingredient name that is being removed
  ingredient_name = $(this)
    .closest('.form-row')
    .find('#ingredient-name')
    .attr('placeholder')
  row = $(this).closest('.form-row')

  $.ajax({
    type: 'DELETE',
    // This route is defined under ingredients.js
    url: '/ingredients/remove/recipe_ingredient/' + ingredient_name,
    data: { recipe_id: recipe_id_being_edited },
    // If ingredient has been removed remove the ingredient row
    success: function() {
      row.remove()
      // Remove whole row
    },
    error: function(err) {
      console.log(err)
      console.log('Could not delete: ' + ingredient_name)
    }
  })
})

// This will trigger when user tries to edit a recipe
$('#editRecipe').on('show.bs.modal', async function(event) {
  // Button that triggered the display card
  var button = $(event.relatedTarget)
  // Get the recipe row based on the button clicked and its closest tr element
  $recipeRow = button.closest('tr').children()

  var values = []
  // For each element in the recipe row array
  for (child in $recipeRow) {
    // for each cell get its index
    var cellIndex = $recipeRow[child].cellIndex
    // Only get RecipeName and ServingSize and RecipeID values based on the cell index of the table
    if (cellIndex == 1 || cellIndex == 2 || cellIndex == 3) {
      values.push($recipeRow[child].innerText)
    }
  }

  //Get ingredients for the recipe
  ingredientsInRecipe = {}
  await $.ajax({
    type: 'GET',
    url: '/ingredients/ingredientsForRecipe/'+values[0],
    success: function(response) {
      // Reload the page to update cards
      ingredientsInRecipe = response
    },
    error: function(err) {
      console.log('Could not retrieve ingredients')
    }
  })
  console.log("TEST")
  console.log(ingredientsInRecipe)

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
  $('#recipe-name').val(values[1])
  // Set placeholders inside input box with a value of recipe serving size that it currently has
  $('#recipe-size').attr('placeholder', values[2])
  $('#recipe-size').val(values[2])
  // Set form html to nothing so it can be updated with new recipe selected
  // This is in case user closes the form overlay and opens it back up
  // Otherwise the form will keep adding rows non stop
  $('#ingredient-rows').html('')
  $('#dynamic-ingredient-row').html('')
  $('#currentRecipeSteps').html('')
  // Populate ingredient rows
  for (ingredient in ingredientsInRecipe) {
    ingredientId = ingredientsInRecipe[ingredient].ingredient_id
    qty = ingredientsInRecipe[ingredient].amount_of_ingredient_needed
    name = ingredientsInRecipe[ingredient].ingredient_name
    measurement = ingredientsInRecipe[ingredient].ingredient_unit_of_measurement
    // get ingredientName
    let ingredientName = name
    // get Qty
    let ingredientQty = qty
    // get measurement
    let ingredientMeasurement = measurement
    // Create a row for an ingredient
    $ingredientRow = `
        <div class="form-row">
            <div class="form-group col-4">
                <input class="form-control dp-form-fields" name="ingredientName" id="ingredient-name" type="text" placeholder="${ingredientName}" value="${ingredientName}" required/>
            </div>
            <div class="form-group col-3">
                <input class="form-control dp-form-fields" name="IngredientQty" id="ingredient-qty" type="text" placeholder="${ingredientQty}" value="${ingredientQty}" required/>
            </div>
            <div class="form-group col-4">
                <select name="IngredientMeasurement" class="form-control dp-form-fields" id="measurement" required>
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
                <button type="button" data-id="${values[0]}" class="btn btn-outline-danger delete-current-ingredient">X</button>
            </div>
            <input style="display:none" name="ingredientId" type="text" value="${ingredientId}" />
        </div>`
    // shows what measurement has already been selected for that specific ingredient
    $ingredientRow = $ingredientRow.replace(
      'value="' + ingredientMeasurement + '"',
      `value ="${ingredientMeasurement}" selected`
    )
    $('#ingredient-rows').append($ingredientRow)
  }
  // hide input field with additional data which wont be displayed to the user but will be used on the route
  var $input = $('<input>')
    .attr('type', 'hidden')
    .attr('name', 'recipeId')
    .val(values[0])
    // add input button defined above
  $('#ingredient-rows').append($input)
  // Send request to get recipe directions
  $.ajax({
    type: 'GET',
    url: '/recipes//getRecipeDirections/' + values[0],
    success: function(response) {
      // Reload the page to update cards
      let recipeSteps = ''
      for (step in response) {
        recipeSteps = recipeSteps + response[step] + '\n'
        $('#currentRecipeSteps').append(`<p>${response[step]}</p>`)
      }
      // add recipe steps to the textarea on the form
      $('#textarea').attr('placeholder', recipeSteps)
    },
    error: function(err) {
      console.log('Could not get directions for recipe ' + values[0])
    }
  })
})
//this will trigger ediding recipes on the card view
$('#editRecipeCard').on('show.bs.modal', function (event) {
  console.log("it worked");
  // Button that triggered the display card
  var button = $(event.relatedTarget)
  // get recipe information from the page to later display it ont he overlay card
  $recipe_id  = button.closest('.card').attr('id')
  $recipe_img = button.closest('.card').attr('image_p')
  $recipe_name = button.closest('.card').attr('r_name')
  $directions = button.closest('.card').attr('r_directions')
  $people =  button.closest('.card').attr('r_serv')
  $ingredient_list = button.closest('.card').attr('ing');
  $ingredient_list = JSON.parse($ingredient_list)

  // add recipe information to the overlay recipe details
  $('h4').text('Editing Recipe - ' + $recipe_name)
  $('h4').addClass('data-id')
  $('#recipe-name').attr('placeholder', $recipe_name)
  $('#recipe-size').attr('placeholder', $people)
  // clear the overlay form from previous data
  $('#ingredient-rows').html('')
  // clear the overlay form from previous data
  $('#dynamic-ingredient-row').html('')

  for (ingredient in $ingredient_list) {
    // split Ingredient name and QtyMeasurement
    var ingredientsSplit = $ingredient_list[ingredient].split(',')
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
                <button type="button" data-id="${$recipe_id}" class="btn btn-danger delete-current-ingredient">X</button>
            </div>
        </div>`
    //Make sure the dropdown has a value selected
    $ingredientRow = $ingredientRow.replace('value="' + ingredientMeasurement + '"', `value ="${ingredientMeasurement}" selected`)
    // append new row
    $('#ingredient-rows').append($ingredientRow)
  }
  // hide input field with recipe id which will be sent in with the form
  var $input = $('<input>').attr('type', 'hidden').attr('name', 'recipeId').val($recipe_id)
  // append hidden recipe_id row
  $('#ingredient-rows').append($input)
})

// Cook it button logic
// Uses ingredients based on the recipe chosen
// Updates dashboard
$(document).ready(function() {
  $('#card-one').on('click', function(e) {
    // get button object clicked
    $target = $(e.target)
    // get data-id value from the button, which is recipe ID
    const id = $target.attr('recipe-id')
    console.log(id)
    // Start AJAX
    $.ajax({
      type: 'GET',
      url: '/users/cook/' + id,
      success: function(response) {
        // Reload the page to update cards
        location.reload()
      },
      error: function(err) {
        console.log('Could not delete: ' + id)
      }
    })
  })
})


// Save community recipe
$(document).on('click', '.saveRecipe', function() {
  // Get id of the community recipe clicked
  $card_id = $(this).closest('.card').attr('id')
    console.log($card_id)

  // Send ajax request with recipe ID that is being copied
  $.ajax({
    type: 'POST',
    url: '/users/saveCommunityRecipe',
    data: { community_recipe_id: $card_id },
    success: function(response) {
      // Reload the page to update cards
      location.reload()
    },
    error: function(err) {
      console.log('Could not copy recipe')
    }
  })
})

// While on the show recipes page, table view.
// Once any recipe row is clicked display ingredient information for that recipe
$('#recipeInformation').on('show.bs.modal', function(event) {
  // clear the overlay modal from previous data if any
  $('#recipe-ingredients').html('')
  // get the object of the row that was pressed
  $button = $(event.relatedTarget)
  // get recipe id which is being viewed
  $recipeId = $button.closest('tr').find('td')[1].innerText
  ingredients = ""
  // retrieve ingredients based on the recipe id
  $.ajax({
    type: 'GET',
    url: '/ingredients/ingredientsForRecipe/'+$recipeId,
    success: function(response) {
      ingredients = response
      // create table with all ingredients to display inside the modal
      html = `
      <table class='table dp-table'>
        <tr>
          <th>Name</th>
          <th>Needed</th> 
        </tr>`
      for (recipe in ingredients){
        html = html + `
        <tr>
          <td>${ingredients[recipe].ingredient_name}</td>
          <td>${ingredients[recipe].amount_of_ingredient_needed} ${ingredients[recipe].ingredient_unit_of_measurement}</td>
        </tr>`
      }
      html = html + `</table>`
      // append the table to the form
      $('#recipe-ingredients').append(html)
    },
    error: function(err) {
      console.log('Could not retrieve ingredients')
    }
  })
})

// When user clicks share recipes while on the community page
// Populate the overlay form with the recipes they already have
$('#shareForm').on('show.bs.modal', function(event) {
  // set overlay form to empty
  $('#recipe-content').html('')
  $.ajax({
    type: 'GET',
    url: '/recipes/getPantryRecipes/',
    success: function(response) {
      // For each recipe in list
      // Add logic not to show recipes that are already shared
      $.each(response, function(index, value) {
        console.log(response)
        recipe_format =
          '<div class="individual-recipe"><div class="media"><img style="width: 30%" class="mr-3" src="$1" alt="Generic placeholder image"><div class="media-body"><h5 class="mt-0 dp-primary-text">$2</h5><p class="dp-title-text">$3</p></div></div></div><br>'
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
    error: function(err) {
      console.log('Could not get recipes')
    }
  })
})

// Share recipe
// Once user selects which recipe to share run this
$(document).on('click', '.individual-recipe', function() {
  // get recipe name that was clicked
  $recipe_name = $(this).find('h5')[0].innerText

  // Send request to API for setting this recipe as sharable recipe
  $.ajax({
    type: 'POST',
    async: false,
    url: '/recipes/share',
    data: { recipe_name: $recipe_name },
    success: function(response) {
      console.log('Recipe: ' + $recipe_name + ' was shared')
      window.location.reload();
    },
    error: function(err) {
      console.log('Could not share recipe to the community')
    }
  })
})

// Once admin clicks change privillege on admin panel this gets called
$('#changePrivilege').on('show.bs.modal', function(event) {
  // get the button object that was clicked
  $button = $(event.relatedTarget)
  // get user id
  user_id = $button.closest('tr').attr('data-id')
  // add a URL where the request will be sent to change users privillege based on users id
  $(this)
    .find('form')
    .attr('action', '/users/changePrivilege/' + user_id)
})

// Once admin click reset password on admin panel this gets called
$('#resetForm').on('show.bs.modal', function(event) {
  // get the button object that was clicked
  $button = $(event.relatedTarget)
  // get user id
  user_id = $button.closest('tr').attr('data-id')
  // add a URL where the request will be sent to reset users password
  $(this)
    .find('form')
    .attr('action', '/users/resetPassword/' + user_id)
})

// Handle image upload for pantry image
$('#OpenImgUpload').click(function() {
  $('#imgupload').trigger('click')
})

// Triggered when admin clicks save button on the admin panel for the new name of the pantry
$('#save-pantryName-btn').click(function savePantryName() {
  // get the name that the user is trying to change pantry name to
  $newName = $('#name').text()

  // Send request to update pantry name in the database
  $.ajax({
    type: 'POST',
    url: '/pantry/changeName',
    data: { pantryName: $newName },
    success: function() {},
    error: function(err) {
      console.log(err)
    }
  })
})

// Once user clicks on edit link for his password run this function
$('#editEmailButton').click(function showEditField(e) {
  // Stop link from refreshing the page
  e.preventDefault()
  $(this).hide()
  // show input field for a user to enter a new password
  $(
    "<div id='newUsername' class='form-row'><div class='form-group col-md-3'><input name='newUsername' class='form-control' placeholder='New Email' required='' ></div></div>"
  ).insertAfter($('#userEmail'))
  // show save button
  $("<button class='btn btn-primary' type='submit' id='saveEmailButton'> Save </button>").insertAfter(
    $('#newUsername')
  )
  // show cancel button
  $(
    "<button class='btn btn-outline-danger' type='button' id='cancelPassEdit'>Cancel</button>"
  ).insertAfter($('#saveEmailButton'))
})

// Once user clicks cancel password change hide cancel button and show edit button
$(document).on('click', '#cancelPassEdit', function cancelPasswordEdit() {
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

// While on the dashboard user can select expiration window to sort their ingredients by
// Once user makes their selections update sort value in the database
$('#sortByTimeFrameBtn').click(function sortByTimeFrame() {
  // get the time frame value that the user has selected
  $timeFrameValue = $('input[data-slider-value]').val()
  // send request to the route to update that value
  $.ajax({
    type: 'POST',
    url: '/pantry/setExpirationTimeFrame',
    data: { expirationTimeFrameValue: $timeFrameValue },
    success: function() {},
    error: function(err) {
      console.log(err)
    }
  })
})

// While on the dashboard/homepage user can specify the number of people they want to cook for
$(document).on('change', '#cookForNumberOfPeople', function updateCookForNumberOfPeople() {
  // get the number of people to cook for
  numberOfPeopleToCookFor = $(this).val()
  // update the number of people to cook for in the database by sending request to middleware
  $.ajax({
    type: 'POST',
    url: '/pantry/setNumberOfPeopleToCookFor',
    data: { numberOfPeople: numberOfPeopleToCookFor },
    success: function() {
      // reload the page to reflect the changes on the UI
      location.reload()
    },
    error: function(err) {
      console.log(err)
    }
  })
})

//When user wants to edit ingredient on tables view this is called
$('#editIngredient').on('show.bs.modal', async function(event) {
  //Button trigger
  var button = $(event.relatedTarget)
  var ingredientId = $(button).attr('data-id')

  $tableRowCells = button.closest('tr').children()
  //JSON object for ingredient data
  var ingredientData = new Object();
  for (child in $tableRowCells) {
    // for each cell get its index
    var cellIndex = $tableRowCells[child].cellIndex
    // Get image src
    if (cellIndex == 0) {
      console.log($tableRowCells[child].children[0].getAttribute('src'))
      ingredientData.image = $tableRowCells[child].children[0].getAttribute('src')
    }
    // Get ingredient name
    else if(cellIndex == 1){
      ingredientData.name = $tableRowCells[child].innerText
    }
    // Get ingredientTotal
    else if(cellIndex == 2){
      ingredientData.total = $tableRowCells[child].innerText
    }
    // Get ingredient measurement
    else if(cellIndex == 3){
      ingredientData.measurement = $tableRowCells[child].innerText
    }
    // Get ingredient expirationDate
    else if(cellIndex == 4){
      ingredientData.expirationDate = $tableRowCells[child].innerText
    }
    // Get ingredient item priority
    else if(cellIndex == 5){
      ingredientData.itemPriority = $tableRowCells[child].innerText
    }
  }
  $('#title-field').text("Editing - " + ingredientData.name)
  $('#newImage').attr('src', ingredientData.image)
  $('#ingredientNameField').attr('placeholder', ingredientData.name)
  $('#ingredientTotalField').attr('placeholder', ingredientData.total)
  $(`.measurementDiv option[value='${ingredientData.measurement}']`).attr('selected', true)
  $(`.priorityDiv option[value='${ingredientData.itemPriority}']`).attr('selected', true)
  $('#ingredientIdField').attr('value', ingredientId)
  $('#ingredientCurrentExpirationDate').attr('value', new Date(ingredientData.expirationDate))
  document.getElementById("dateSelector").valueAsDate = new Date(ingredientData.expirationDate)
})