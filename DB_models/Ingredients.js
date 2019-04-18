// setting up the models for useing the database
// this is the model for the  table ingredients the digital_pantry db


const Sequelize = require('sequelize')
const db = require('../databaseMySQL.js')

const Ingredients = db.define(
  'ingredients',
  {
    ingredient_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

    ingredient_name: { type: Sequelize.STRING },
    ingredient_weight: { type: Sequelize.STRING },
    ingredient_image_path: { type: Sequelize.STRING },
    ingredient_num_times_cooked: { type: Sequelize.INTEGER },
    priority: { type: Sequelize.STRING }
  },
  {
    timestamps: false,
    underscored: true
  }
)

module.exports = Ingredients
