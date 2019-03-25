// setting up the models for useing the database
// this is the model for the  table ingredients_in_pantry the digital_pantry db

/*
===============================================================================================
|ingredient_id | ingredient_amount | ingredient_unit_of_measurement | ingredient_expiration_date|
| int fk       | float             |    enum                        | date
| ref          |
| ingredients  |
==================================================================================================
*/

const sequelize = require('sequelize')
// const ingredients = require('./Ingredients')
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

// relationsshipes

        ingredient_expiration_date:{
            type: sequelize.DATEONLY
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored:true
    }
);
ingredients_in_pantry.removeAttribute('id')

module.exports = ingredients_in_pantry
