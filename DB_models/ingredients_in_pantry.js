// setting up the models for useing the database
// this is the model for the  table ingredients_in_pantry the digital_pantry db


const sequelize = require('sequelize')

const db = require('../databaseMySQL.js')

const ingredients_in_pantry = db.define('ingredients_in_pantry', {
  ingredient_id: {
    type: sequelize.INTEGER,
    foreignKey: true
  },
  pantry_id: {
    type: sequelize.INTEGER,
    foreignKey: true
  },

  ingredient_amount: {
    type: sequelize.FLOAT
  },

  ingredient_unit_of_measurement: {
    type: sequelize.ENUM('tsp.', 'tbsp.', 'fl oz', 'cup', 'quart', 'ml', 'lb', 'oz')
  },

  ingredient_expiration_date: {
    type: sequelize.DATEONLY
  }
},
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  }
)



//api puts in an id field.
//using ingredient id instead
ingredients_in_pantry.removeAttribute('id')

module.exports = ingredients_in_pantry
