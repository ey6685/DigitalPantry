const express = require('express')

const router = express.Router()

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

module.exports = router
