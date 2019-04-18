//THIS FILE HAS GENERAL PANTRY FUNCTIONALITIES

const express = require('express')

const router = express.Router()
const Op = require('sequelize').Op
const Pantry = require('../DB_models/Pantry')
const User = require('../DB_models/Users')
const mail = require('../functions/mailer')
const val = require('../functions/Input_cleaner')


// TODO Below can potentially cause issues if the new entry in the pantry table is not created when new user is registered
// In other words if we try to update a pantry name that does not exist it will break
// Make sure to create this entry in this table when new user is registered
router.post('/changeName', async function changePantryName (req, res) {
  // get new pantry name from the user and sanitize input
  var newPantryName = await val.string_cleaning(req.body.pantryName)
  {
    //get user id
    const currentUserId = req.session.passport['user']
    // Find which pantry user is from
    const pantryId = `(SELECT (pantry_id) FROM users WHERE user_id=${currentUserId})`
    // Update pantry name of currently logged in user
    const query = `UPDATE pantry set pantry_name="${newPantryName}" WHERE pantry_id=${pantryId};`
    db.query(query, function checkErrors (err) {
      if (err) throw err
      // respond to Jquery request
      res.send('Success')
    })
  }

})

//sets expirationdate for all ingredients to get sorted by in days
router.post('/setExpirationTimeFrame', async function setExpirationTimeFrame (req, res) {
  //get users input and sanitize it
  const expirationTimeFrameInDays = await val.num(req.body.expirationTimeFrameValue)
  if(expirationTimeFrameInDays >=0){
  const currentUserId = req.session.passport['user']
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: { user_id: currentUserId }
  })
  //update value in teh database
  Pantry.update(
    { expire_window: expirationTimeFrameInDays },
    { where: { pantry_id: pantryId.pantry_id } }
  )
  }
  else{
    req.flash("error","Invalid number of days.")
  }
  res.redirect('/users/dashboard')
})
//set number of people the user is cooking for
router.post('/setNumberOfPeopleToCookFor', async function setNumberOfPeopleToCookFor(req, res){
  // get the number of people user is cooking for
  const numberOfPeople = await val.num(req.body.numberOfPeople)
  // get current user id form the sessions
  const currentUserId = req.session.passport['user']
  // get pantry user's pantry id
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: { user_id: currentUserId }
  })
  // update the value in databse of number of people user is cooking for
  await Pantry.update({
    people_cooking_for:numberOfPeople
  },
  {where:{pantry_id:pantryId.pantry_id}}
  )
  res.send('success')
})

module.exports = router
