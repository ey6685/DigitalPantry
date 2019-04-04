// ///////////////////////////////////////////
// this file is for setting up an object to //
// interact with our pantry table in the db.//
// ///////////////////////////////////////////

// reqires
const Sequelize = require('sequelize')
const db = require('../databaseMySQL.js')

// db table
/*
=================================================================================================================================================================
|pantry_id: int PK| pantry_name: varchar(32)|
=================================================================================================================================================================
*/

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
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)
Pantry.removeAttribute('id')
// relations
// Pantry.hasMany(recipes, {foreignKey: "pantry_id", sourceKey: "pantry_id"})

module.exports = Pantry

// testing code////////////////////////////////////////

// Pantry.create({
//     pantry_name: "test default values"
//     // pantry_ingredients_used_month: 10,
//     // pantry_ingredients_wasted_month: 10,
//     // pantry_ingredients_used_YTD     : 10,
//     // pantry_ingredients_wasted_YTD   : 10,

//     // recipes_cooked_month            : 10,
//     // recipes_cooked_YTD              : 10
// })
// ///////////////////////////////////////////////////
