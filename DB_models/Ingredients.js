// setting up the models for useing the database
// this is the model for the  table ingredients the digital_pantry db

/*
===========================================================================================================
|ingredient_id | ingredient_name | ingredient_weight | ingredient_image_path | ingredient_num_times_cooked|
|int pk autoin | varchar(32)     |   int             |    text               |  int                       |
===========================================================================================================
*/

const Sequelize = require('sequelize')
const ingredients_in_pantry = require('./ingredients_in_pantry')
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
// Ingredients.removeAttribute('id');
//define relations
// Ingredients.hasMany(ingredients_in_pantry,  {as: "inforeignKey: 'ingredient_id', sourceKey : 'ingredient_id'});
// Ingredients.belongsTo(ingredients_in_pantry, {foreignKey:'ingredient_id'});

module.exports = Ingredients
