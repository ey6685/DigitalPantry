const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');



const Ingredients_in_Recipe = db.define('Ingredients_in_Recipe', {
    ingredient_id                 : {type: Sequelize.INTEGER},
    recipe_id                     : {type: Sequelize.INTEGER},
    recipe_ingredient_qty         : {type: Sequelize.FLOAT},
    recipe_ingredient_measurement : {type: Sequelize.STRING},
    recipe_pantry_id              : {type: Sequelize.INTEGER}
},
{
    timestamps: false
});
Ingredients_in_Recipe.removeAttribute('id');
module.exports = Ingredients_in_Recipe;