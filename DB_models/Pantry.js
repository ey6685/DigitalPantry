/////////////////////////////////////////////
//this file is for setting up an object to //
//interact with our pantry table in the db.//
/////////////////////////////////////////////

//reqires
const Sequelize =  require('sequelize');
const db = require('../databaseMySQL');


//db table
//_______________________________________________________________________________________
//|pantry_id| pantry_name| pantry_ingredients_used_month| pantry_ingredients_wasted_month| ---->
//---------------------------------------------------------------------------------------
//|pantry_ingredients_used_YTD| pantry_ingredients_wasted_YTD| recipes_cooked_month| recipes_cooked_YTD
//------------------------------------------------------------------------------------------------------


const Pantry = db.define("pantry", 
    {
    pantry_id                       : {type: Sequelize.INTEGER,
                                       primaryKey: true,
                                       autoIncrement: true},

    pantry_name                     : {type: Sequelize.STRING},

    pantry_ingredients_used_month   : {type: Sequelize.INTEGER,
                                       defaultValue: 0},
    pantry_ingredients_wasted_month : {type: Sequelize.INTEGER,
                                       defaultValue: 0},

    pantry_ingredients_used_YTD     : {type: Sequelize.INTEGER,
                                       defaultValue: 0},
    pantry_ingredients_wasted_YTD   : {type: Sequelize.INTEGER,
                                       defaultValue: 0},

    recipes_cooked_month            : {type: Sequelize.INTEGER,
                                       defaultValue: 0},
    recipes_cooked_YTD              : {type: Sequelize.INTEGER,
                                       defaultValue: 0}
    },
    {
        timestamps     : false,
        freezeTableName: true
    }        
);

module.exports = Pantry;



///testing code////////////////////////////////////////

// Pantry.create({
//     pantry_name: "test default values"
//     // pantry_ingredients_used_month: 10,
//     // pantry_ingredients_wasted_month: 10,
//     // pantry_ingredients_used_YTD     : 10,
//     // pantry_ingredients_wasted_YTD   : 10,

//     // recipes_cooked_month            : 10,
//     // recipes_cooked_YTD              : 10
// });
/////////////////////////////////////////////////////
