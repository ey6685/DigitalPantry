// CREATED BY OSKARS DAUKSTS
// This file contains JQuery functions for cooking a recipe
// These details are shown once user clicks 'Cook It!'
// Undo button which is located on the dashboard page

$(document).on('click', '#finishCooking', function finishCooking (e) {
  $target = $(e.target)
  // get data-id value from the button, which is recipe ID
  const id = $target.attr('recipe-id')
  // Start AJAX and pass in the ID of the recipe being cooked
  $.ajax({
    type: 'GET',
    url: '/users/cook/' + id,
    success: function (response) {
      // Reload the page to update cards
      window.location.href = '/users/dashboard'
    },
    error: function (err) {
      console.log('Could not cook recipe with id: ' + id)
    }
  })
})

// Undos cooking a recipe.
// In other words puts ingredients back into pantry
$(document).on('click', '#undoCooking', function (e) {
  e.preventDefault()
  cookedRecipeData = localStorage.getItem('recipe')
  $(this).hide()
  // Clear local storage after recipe ingredients are returned
  localStorage.clear()
  $.ajax({
    type: 'POST',
    data: {'cookedRecipe': cookedRecipeData},
    url: '/recipes/undo/',
    success: function (response) {
      // Reload the page to update cards
      localStorage.clear()
      location.reload()
    // console.log(JSON.parse(response))
    },
    error: function (err) {
      console.log('Something went wrong: ' + err)
    }
  })
})

// Calculates ingredients required based the number of people user is trying to feed
$('#servingSizeField').change(function updateIngredientAmount () {
  numberOfPeopleToCookFor = $(this).val()
  // Make sure field is not empty on keyup
  if (numberOfPeopleToCookFor !== '') {
    $.ajax({
      type: 'POST',
      url: '/pantry/setNumberOfPeopleToCookFor',
      data: { numberOfPeople: numberOfPeopleToCookFor },
      success: function () {location.reload()},
      error: function (err) {
        console.log(err)
      }
    })
  }
})

$(document).on('click', '#backButton', function (e) {
  localStorage.clear()
})
