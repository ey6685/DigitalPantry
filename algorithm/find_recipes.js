/// function to recommend recipes for the expiring ingredient

//inputs
//ingredient id

// outputs: an array of recipe_ids

//outputs: an array of recipe_ids

//requires

const recipe_t = require('../DB_models/Recipes');
const ingredients_in_a_recipe_t = require('../DB_models/ingredients_in_a_recipe');
const ingredients_in_pantry_t = require('../DB_models/ingredients_in_pantry');
const unit_convert = require('./Convert_unts');
const op = require('sequelize').Op;
const logger = require('../functions/logger');
const ing_totaler = require('./total_of_ingredient');
const ingredient_t = require('../DB_models/Ingredients');
const direction_parser = require('../recipe_direction_parser');
const JSON_sort = require('sort-json-array');
/*
function: find_recipes_no_inv

inputs
1)ingredient id
2)pantry id

outputs
                {
                    "recipe_id" : int
                    "recipe_name" : string
                    "recipe_image_path":  string
                    "recipe_directions" : string
                    "num_of_ingredients" : int
                    "num_of_ingredients_on_hand": int 
                    "ingredients_required":  JSON 
                    "ingredients_on_hand" : JSON

                })

returns

description
checks for the best recipes for the ingredient id provided and returns them
does not check if we have all the ingredientis*/

async function find_recipes_no_inv(ingredient_id, pantry_id,scale){
    

    try{
        var today = new Date();
        var returning_JSON = new Array();
        var recieps_ing_in = await ingredients_in_a_recipe_t.findAll({
            where : {
                ingredient_id: ingredient_id,
                pantry_id: pantry_id
            }
        });
        if(scale == null || typeof scale != 'number'){
            scale = -1
        }

        console.log("THE RECIPE IDS FOUND");
        console.log("====================");
        console.log(JSON.stringify(recieps_ing_in))

        //makeing JSON data
        var recipe_ids_arr = new Array();//mark name for later
        for(var i=0; i<recieps_ing_in.length; i++)
        {
            recipe_ids_arr.push(recieps_ing_in[i].recipe_id);
        }
        console.log(JSON.stringify(recipe_ids_arr));

        //get the rest of the date per id
        var ingredients_we_have = new Array();
        
        // var ingredients_we_dont = new Array();

        for(var i = 0;i<recipe_ids_arr.length;i++)
        {
            var recipe_table_data;
            recipe_table_data = await recipe_t.findOne({
            attributes: ['recipe_name','recipe_image_path','recipe_directions','num_people_it_feeds',"recipe_num_times_cooked"],
            where:{
                recipe_id: recipe_ids_arr[i],
                pantry_id: pantry_id
            }})
            console.log("=====================")
            console.log("REMAINING RECIPE DATE")
            console.log("=====================")
            console.log(JSON.stringify(recipe_table_data))
            var recipe_scale;
            if(scale == -1)
            {
                scale = recipe_table_data.num_people_it_feeds;
            }
            //use this for the scalling factor
            recipe_scale = scale/recipe_table_data.num_people_it_feeds;
            console.log("scaling recipe by: " + recipe_scale)
            console.log("=====================================")
            
            var ingredients_we_have = new Array();
            // var ingredients_we_dont = new Array();
            var ingredients_recipe = await ingredients_in_a_recipe_t.findAll({
                attributes:['ingredient_id','amount_of_ingredient_needed','ingredient_unit_of_measurement'],
                where :{
                    recipe_id : recipe_ids_arr[i],
                    pantry_id: pantry_id
                }
            });
            console.log("list of ingredients we need")
            console.log("===========================")
            console.log(JSON.stringify(ingredients_recipe));
            var num_ing_we_have=0;
            //now to seperate the ingredients into have and dont have enought arrays
            for(var o=0;o<ingredients_recipe.length; o++)
            {
                var sum = await ing_totaler.total_ingredients(ingredients_recipe[o].ingredient_id, pantry_id, ingredients_recipe[o].ingredient_unit_of_measurement);
                var name = await ingredient_t.findOne({
                    attributes : ["ingredient_name","ingredient_weight"],
                    where:{
                        ingredient_id: ingredients_recipe[o].ingredient_id
                    }
                })
                console.log("sum >= needed")
                console.log("=============")
                console.log(sum + ">=" + ingredients_recipe[o].amount_of_ingredient_needed * recipe_scale)
                if(sum >= ingredients_recipe[o].amount_of_ingredient_needed * recipe_scale|| name.ingredient_weight == 0){
                    console.log("mun ing we have icremented!");
                    num_ing_we_have++;
                }
                
                    ingredients_we_have.push( {
                        "ingredient_id" : ingredients_recipe[o].ingredient_id,
                        "ingredient_name" : name.ingredient_name,
                        "ingredient_sum" : sum,
                        "ingredient_unit_of_measurement" : ingredients_recipe[o].ingredient_unit_of_measurement
                    })
                
            }
            console.log("INGREDENTS WE HAVE")
            console.log("==================")
            console.log(JSON.stringify(ingredients_we_have))

        //now need some data from the recipes table
        // var recipe_table_data;
        // recipe_table_data = await recipe_t.findOne({
        //     attributes: ['recipe_name','recipe_image_path','recipe_directions','num_people_it_feeds',"recipe_num_times_cooked"],
        //     where:{
        //         recipe_id: recipe_ids_arr[i],
        //         pantry_id: pantry_id
        //     }})
        //     console.log("=====================")
        //     console.log("REMAINING RECIPE DATE")
        //     console.log("=====================")
        //     console.log(JSON.stringify(recipe_table_data))

            //making the JSON return object
            //scale the required ingredients
            for(var i = 0; i<ingredients_recipe.length;i++)
            {
                ingredients_recipe[i].amount_of_ingredient_needed = ingredients_recipe[i].amount_of_ingredient_needed * recipe_scale
                console.log("new ingredient amount: " + ingredients_recipe[i].amount_of_ingredient_needed)
            }

            console.log("ingredients wwe need with scale " + recipe_scale)
            console.log("============================================")
            console.log(JSON.stringify(ingredients_recipe))
            if(recipe_ids_arr.length>0)
            {
                var direction_array = await direction_parser.parse_by_str_for_dashboard(recipe_table_data.recipe_directions)
                returning_JSON.push({
                    "recipe_id" : recipe_ids_arr[0],
                    "recipe_name" : recipe_table_data.recipe_name,
                    "recipe_image_path": recipe_table_data.recipe_image_path,
                    "recipe_directions" : direction_array,
                    "num_of_ingredients" : ingredients_recipe.length,
                    "num_of_ingredients_on_hand": num_ing_we_have,
                    "ingredients_required":  ingredients_recipe,
                    "ingredients_on_hand" : ingredients_we_have,
                    "num_of_times_cooked": recipe_table_data.recipe_num_times_cooked,
                    "persent_have": parseFloat(num_ing_we_have/ingredients_recipe.length)

                })
            }
            else{
                returning_JSON.push({
                    "recipe_id" : recipe_ids_arr[i],
                    "recipe_name" : "NO RECIPES. why not add some to your pantry",
                    "recipe_image_path": '/images/placeholder.jpg',
                    "recipe_directions" : " ",
                    "num_of_ingredients" : 0,
                    "num_of_ingredients_on_hand": 0,
                    "ingredients_required":  " ",
                    "ingredients_on_hand" : " "                    
                })
            }

        }//end of main for loop


                
            
        
 
        //now that we have the ingredients for each recipe
        //time to make the JSON object that we are reutnring
        // for(var i=0;i<recipe_ids_arr.length;i++){
        //     returning_JSON.push({
        //         "recipe_name": recipe_table_data[i].recipe_name,
        //         "recipe_id" : recipe_ids_arr[i],//might not need
        //         "recipe_image_path": recipe_table_data[i].recipe_image_path,
        //         "recipe_directions" : recipe_table_data[i].recipe_directions,
        //         "num_of_people_it_feeds" : recipe_table_data[i].num_of_people_it_feeds,
        //         "ingredients_needed": all_ingredients_in_recipe[i]
        //     })
        // }

        console.log("Returning json data")
        console.log("===================")
        for(var i = 0;i<returning_JSON.length;i++)
            {console.log(JSON.stringify(returning_JSON[i]));}

        return JSON_sort(returning_JSON,"persent_have",'des');
    }catch(err){
        console.log(err)
        return -1;
    }
}
//TEDTING CODE
//  find_recipes_no_inv(19,1,10);
module.exports.find_recipes_no_inv = find_recipes_no_inv;