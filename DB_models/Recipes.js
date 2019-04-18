

const Sequelize = require('sequelize')
const db = require('../databaseMySQL.js')

const Recipes = db.define(
  'recipes',
  {
    recipe_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },

    recipe_name: {
      type: Sequelize.STRING
    },

    recipe_image_path: {
      type: Sequelize.INTEGER,
      default: null
    },
    recipe_directions: {
      type: Sequelize.TEXT
    },
    pantry_id: {
      type: Sequelize.INTEGER
    },
    recipe_num_times_cooked: {
      type: Sequelize.TEXT
    },

    num_people_it_feeds: {
      type: Sequelize.INTEGER
    },

    sharable: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
)

module.exports = Recipes
