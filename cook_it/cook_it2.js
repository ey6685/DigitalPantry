/*
this file containt cookit2.5

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

//easier to use raw sql by building a query string
const mysql = require('mysql');
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'digital_pantry',
    multipleStatements:true
});


//function
async function cook_it2(recipe_id, pantry_id, people_to_fed)
{
    try{
        console.log("/n=====================\nstarted cook it.\n=======================\n");
        //check data
        var scale
        console.log("data recived:\nrecipe id: " + recipe_id +"\npantry_id: " + pantry_id +"\npeople to fed: " + people_to_fed +'\n');
        if(recipe_id == null)
        {
            throw "no recipe id";
        }
        // else if(typeof recipe_id != 'number')
        // {
        //     throw 'recipe_id not a number'
        // }
        
        if(pantry_id == null)
        {
            pantry_id = 1;
        }
        else if(typeof pantry_id != 'number')
        {
            throw "pantry_id not a number";
        }

        if(people_to_fed == null)
        {
            scale=1;
        }
        else
        {

            //calc the scale to determin how much of the ingredients
            var recipe_scale = await recipe_t.findOne({
                attributes: ['num_people_it_feeds'],
                where:{
                    recipe_id : recipe_id
                }
            });
            
            scale = parseInt((people_to_fed / recipe_scale.num_people_it_feeds));
            console.log("scale before convertered: " + scale)
            if(people_to_fed < recipe_scale.num_people_it_feeds)
                {scale = 1;}
            else if(people_to_fed % recipe_scale.num_people_it_feeds >0)
                {scale++;}
            if(scale == NaN)
                scale = 1;
            console.log("recipe_scale: " + JSON.stringify(recipe_scale));
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
        
        //for every ingredinet in the recipe
        //we need to check to see if we have it in stock

       // ingredients_in_the_recipe.forEach(async function(current)
       for(var i = 0; i<ingredients_in_the_recipe.length; i++) 
       {
            //get the ingredintd inthe stock
            var ing_in_stock;
            console.log("adding " + ingredients_in_the_recipe[i].ingredient_id,pantry_id + " " + ingredients_in_the_recipe[i].ingredient_unit_of_measurement);
            ing_in_stock = await ing_totaler.total_ingredients(ingredients_in_the_recipe[i].ingredient_id,pantry_id, ingredients_in_the_recipe[i].ingredient_unit_of_measurement)

            if(ing_in_stock < ingredients_in_the_recipe[i].amount_of_ingredient_needed * scale)
            {
                console.log("flag flipped:{")
                flag_have_all = false;  
            }
        }
        
        //if we have the ingredients in stock
        console.log("flag: " + flag_have_all);
        if(flag_have_all)
        {  
            var amount;
            var query_str = "";
            //await ingredients_in_the_recipe.forEach(async function(current)
            for(var i=0; i<ingredients_in_the_recipe.length; i++)
            {   
                var amount_need = ingredients_in_the_recipe[i].amount_of_ingredient_needed * scale;
                console.log("amount_needed= " + ingredients_in_the_recipe[i].amount_of_ingredient_needed +' * '  + scale)
                var current_ingredient = await in_pantry_t.findAll({
                    where: {
                        ingredient_id: ingredients_in_the_recipe[i].ingredient_id
                    },
                    order: ['ingredient_expiration_date']
                });

                amount = 0;
                for(var o =0; o<current_ingredient.length; o++)
                {
                    amount = current_ingredient[o].ingredient_amount;
                    //check units of measurement
                    if(current_ingredient[o].ingredient_unit_of_measurement != ingredients_in_the_recipe[i].ingredient_unit_of_measurement)
                    {
                        amount = await unit_converter.converter_raw(amount, current_ingredient[o].ingredient_unit_of_measurement,ingredients_in_the_recipe[i].ingredient_unit_of_measurement);
                    }
                    console.log(amount + " >= " + amount_need)
                    if(amount >= amount_need)
                    {
                        console.log('current_ingredient - amount needed: ' + current_ingredient[o].ingredient_amount + ' - ' + amount_need)
                        query_str = query_str+  "UPDATE ingredients_in_pantry SET ingredient_amount = " + (current_ingredient[o].ingredient_amount - amount_need) + " WHERE ingredient_id = " + current_ingredient[o].ingredient_id + " AND ingredient_expiration_date = '" + current_ingredient[o].ingredient_expiration_date +"'; ";
                        break;
                    }
                    else
                    {
                        amount_need -= current_ingredient[o].ingredient_amount;
                        query_str = query_str+ "UPDATE ingredients_in_pantry SET ingredient_amount = 0, ingredient_expiration_date = null  WHERE ingredient_id = " + current_ingredient[o].ingredient_id + " AND ingredient_expiration_date = '" + current_ingredient[o].ingredient_expiration_date + "'; ";
                    }
                }


            
            }
            //});//end of for each
        //end of checking if the flag has been fliped
        

        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+")
        console.log("the string:\n" +query_str);
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+")
        db.query(query_str,(err,res)=>{
            if(err) throw err;
            console.log(JSON.stringify(res));
        });
     }//if we have all
     return flag_have_all
    }//try
    catch(err)
    {
        console.log(err);
    }
}

module.exports.cook_it2 = cook_it2;
//cook_it2(1,1,1);