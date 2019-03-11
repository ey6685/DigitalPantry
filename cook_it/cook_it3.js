/*
this file containt cookit2.5?

description:
this function will take a recipe_id and cook it. this meaning it will:
1)check to see if the ingredients are still there(zeus forbid they are not)
2)take the ingredients out
3?)log stats if possible.

inputs
-int : recipe_id   : what are we cooking
-int : pantry_id   : where you at
-int : peopel fed  : how many people we are cooking for


outputs


datebase updates:
-the ingredients used taken out the database
-?stats?
*/



//requires
const recipe_t = require('../DB_models/Recipes');
const in_recipe_t = require('../DB_models/ingredients_in_a_recipe');
const in_pantry_t = require('../DB_models/ingredients_in_pantry');
const unit_converter = require('../algorithm/Convert_unts');
const ing_totaler = require('../algorithm/total_of_ingredient');


//function
async function cook_it2(recipe_id, pantry_id, people_to_fed)
{
    try{
        //check data
        var scale=0.0;
        if(recipe_id == null)
        {
            throw "no recipe id";
        }
        else if(typeof recipe_id != 'number')
        {
            throw 'recipe_id not a number'
        }
        
        if(pantry_id == null)
        {
            throw "no pantry_id";
        }
        else if(typeof pantry_id != 'number')
        {
            throw "pantry_id not a number";
        }

        if(people_to_fed == null || typeof people_to_fed != 'number')
        {
            scale=1;
        }
        else
        {

            //calc the scale to determin how much of the ingredients
            var recipe_scale = await recipe_t.findOne({
                attributes: ['recipe_people_it_feeds'],
                where:{
                    recipe_id : recipe_id
                }
            });
            console.log("recipe_scale: " + JSON.stringify(recipe_scale));
            scale = people_to_fed / recipe_scale.recipe_people_it_feeds;
            if(people_to_fed < recipe_scale.recipe_people_it_feeds)
                scale = 1;
            else if(people_to_fed % recipe_scale.recipe_people_it_feeds >0)
                scale++;
        }
        console.log("scale: " + scale + '\n');
        //get the ingredients we need to cook
        var ingredients_in_the_recipe = await in_recipe_t.findAll({
            where:{
                recipe_id: recipe_id,
                pantry_id: pantry_id
            }
        });
        console.log("\n" + JSON.stringify(ingredients_in_the_recipe));
        //make sure we got all the ing
        var flag_have_all = true;
        var ing_in_stock;
        //for every ingredinet in the recipe
        //we need to check to see if we have it in stock

        ingredients_in_the_recipe.forEach(async function(current)
        {
            //get the ingredintd inthe stock
            ing_in_stock = await ing_totaler.total_ingredients(current.ingredient_id,pantry_id, current.ingredient_unit_of_measurement)

            if(ing_in_stock < current.amount_of_ingredient_needed)
                flag_have_all = false;  
        });
        //if we have the ingredients in stock
        //hey jackass you just found out you havethe ingredients (true) or you dont
        //START HERE
        if(flag_have_all)
        {
            ingredients_in_the_recipe.forEach(async function(current)
            {

            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}


cook_it2(1,1,1);