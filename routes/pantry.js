const express = require('express')

const router = express.Router()
const Op = require('sequelize').Op
const Pantry = require('../DB_models/Pantry')
const User = require('../DB_models/Users')

// TODO Below can potentially cause issues if the new entry in the pantry table is not created when new user is registered
// In other words if we try to update a pantry name that does not exist it will break
// Make sure to create this entry in this table when new user is registered
router.post('/changeName', function changePantryName (req, res) {
  const newPantryName = req.body.pantryName
  const currentUserId = req.session.passport['user']
  // Find which pantry user is from
  const pantryId = `(SELECT (pantry_id) FROM users WHERE user_id=${currentUserId})`
  // Update pantry name of currently logged in user
  const query = `UPDATE pantry set pantry_name='${newPantryName}' WHERE pantry_id=${pantryId};`
  console.log(query)
  db.query(query, function checkErrors (err) {
    if (err) throw err
    // respond to Jquery request
    res.send('Success')
  })
})

router.post('/setExpirationTimeFrame', async function setExpirationTimeFrame (req, res) {
  const expirationTimeFrameInDays = req.body.expirationTimeFrameValue
  const currentUserId = req.session.passport['user']
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: { user_id: currentUserId }
  })

  Pantry.update(
    { expire_window: expirationTimeFrameInDays },
    { where: { pantry_id: pantryId.pantry_id } }
  )

  req.flash('success', 'WORK PLS')
  console.log('REQ.FLASH')
  console.log(req.flash)
  res.redirect('/users/dashboard')
})

module.exports = router
