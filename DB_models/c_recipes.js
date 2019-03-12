/*
model for use of the community recipes table in the database
*/

const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');

const c_recipes = db.define(
  'community_recipes',
  {
    c_recipe_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },

    c_recipe_name: {
      type: Sequelize.STRING
    },

    c_recipe_serving_size: {
      type: Sequelize.FLOAT
    },
    c_recipe_directions: {
      type: Sequelize.STRING
    },

    c_recipe_path: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);

module.exports = c_recipes;
