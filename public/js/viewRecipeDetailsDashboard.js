// CREATED BY OSKARS DAUKSTS
// This file contains logic for viewing recipe details
// These details are shown once user clicks View button on the dashboard

$(document).on('click', '#showRecipeDetails', function () {
  // set all HTML to nothing to start fresh
  $('#recipeStepsOverlay').html('')
  // Get recipe name
  $recipeName = $(this).closest('.card').find('h4').text()
  // Get recipe steps and load them into array as objects
  var recipeStepsArray = $(this).closest('.card').find('.recipeStep').toArray()

  $('h5').text($recipeName)
  for (step in recipeStepsArray) {
    console.log(recipeStepsArray[step].innerText)
    $('#recipeStepsOverlay').append(`<p>${recipeStepsArray[step].innerText}<p>`)
  }
})
