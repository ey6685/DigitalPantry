// ///////////////////////////////////////////
// this file is for setting up an object to //
// interact with our pantry table in the db.//
// ///////////////////////////////////////////

// reqires
const Sequelize = require('sequelize')
const db = require('../databaseMySQL.js')

const Pantry = db.define(
  'pantry',
  {
    pantry_id: {
      type: Sequelize.INTEGER,
      primarykey: true
    },
    pantry_name: {
      type: Sequelize.STRING
    },
    expire_window: {
      type: Sequelize.INTEGER
    },
    people_cooking_for:{
      type: Sequelize.INTEGER
    },
    pantry_image_path: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)
Pantry.removeAttribute('id')


module.exports = Pantry
