// AUTHORS:
// Patrick
// Oskars
// This file contains a model for the Users table in SQL database
// This file also contains functions required to communicate with the database

/*
==============================================================================
username   | user_password | user_email |pantry_id
varchar(32)| string        |  string    | int fk ref pantry
*/
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../databaseMySQL.js')

// CREATED BY PATRICK
// Defines User model
const Users = db.define(
  'users',
  {
    username: {
      type: Sequelize.STRING
    },

    user_password: {
      type: Sequelize.STRING
    },
    user_email: {
      type: Sequelize.STRING
    },
    pantry_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
)
Users.removeAttribute('id')

const User = (module.exports = Users)

// CREATED BY OSKARS
// Creates user with a hash and saves it to the database
module.exports.createUser = function create(newUser, callback) {
  // Generate salt
  bcrypt.genSalt(10, function generateSalt(err, salt) {
    console.log('GENERATING SALT')
    // Hash password with the generated salt
    bcrypt.hash(newUser.user_password, salt, async function makeHash(error, hash) {
      console.log('GENERATING HASH')
      newUser.user_password = hash
      newUser.username = 'admin'
      await newUser.save()
      callback(hash)
    })
  })
}

// CREATED BY OSKARS
// Retrieves the user by email
module.exports.getUserByEmail = async function get(username) {
  const results = await User.findOne({ where: { user_email: username } })
  return results
}

// CREATED BY OSKARS
// Retrieves the user by ID
module.exports.getUserById = async function getThatID(id) {
  const results = await User.findById(id)
  return results
}

// CREATED BY OSKARS
// Recieves a password that user has entered in the login form
// Hashes that password and compares to the hash inside the database
module.exports.comparePassword = function compare(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function compareHashes(err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
