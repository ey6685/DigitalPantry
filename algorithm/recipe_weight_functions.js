/*this file contains the functions for using the weight system
it has:
1)weight_total     : totals the weight for a recipe
2)ing_is_greatest  : checkes to see what the greatest ingredient weight provided and return
3)recipe_is_greatest: checks to see if the first recipe id's weight is greater then the second

*/


//requires

const ingredient_t           = require('../DB_models/Ingredients');
const recipe_t               = require('../DB_models/Recipes');
const ingredient_in_recipe_t = require('../DB_models/ingredients_in_a_recipe');
const ingrediet_in_pan       = require('../DB_models/ingredients_in_pantry');
const op                     = require('sequelize').Op;





/*
weight total

desciption:
takes a recipe_id and querys the ingredients in a recipe table for all of the ingredients.
with this data it then querys the for the ingredient table for the matching ingredient weights.
total them up and return the value

inputs
-int: recipe id

outputs
-progress to the console

-returns
int: total of the weights
*/

async function weight_total(recipe_id)
{
    //check data
    try{

    
        if(recipe_id == null)
        {
            throw 'no recipe id given\n';
        }
        else if(typeof recipe_id != 'number')
        {
            throw 'recipe id not a number';
        }

        //done checking data
        var ingredient_in_recipe_results = await ingredient_in_recipe_t.findAll({
            attributes: ['ingredient_id'],
            where:{
                recipe_id:recipe_id
            }
        });

        console.log("the ingredients ids to total: \n" + JSON.stringify(ingredient_in_recipe_results));

        //make a quick array for clearer one query
        var ingredients = new Array();
        for(var i = 0; i<ingredient_in_recipe_results.length; i++)
        {
            ingredients.push(ingredient_in_recipe_results[i].ingredient_id);
        }
        console.log("array for one query:\n" + ingredients );

        //query for the ingredient weights
        var the_weights = await ingredient_t.findAll({
            attributes: ['ingredient_weight'],
            where: {
                ingredient_id: {[op.in] : ingredients}
            }
        });

        console.log("the ingredient weight: \n" + JSON.stringify(the_weights));

        //sum the weights
        var sum = 0;
        for(var i = 0; i<the_weights.length; i++)
        {
            sum += the_weights[i].ingredient_weight;
        }
        console.log("returning the sum of weights: " + sum);
        return sum;
    }
    catch(err)
    {
        console.log("error in weight_total():\n" + err);
        return -1;
    }
}

module.exports.weight_total = weight_total;

//test wieght code
// weight_total(1);

/*
ing_is_greatest

description:
this function is takes an array of ids and returns the one with the greatest weight.
ties will be broken by ingredient amount.

first we will check to see if the data is corrected
1)if it is there
2)if it is an array
3)if it is an object //for query returns...

then we query for the weights/amounts of the ingredients
find the one with the highest weigt/amount and return its id.

inputs
--array/object with ingredient ids

outputs
--progress to the console

returns
--id with the highest weight
-- -1 if err
*/

async function ing_is_greatest(ing_ids)
{
    //checking data
    try{
        //flags for how we willdo things
        var is_array = false;
        var is_object = false;
        var id_to_return = -1;
        if(ing_ids == null)
        {
            throw "no ids provided";
        }
        else if(ing_ids[0].ingredient_id !=null)
        {
            //set flag
            console.log("data passed is an object\n");
            is_object = true;
        }
        else if(Array.isArray(ing_ids))
        {
            //set flag
            console.log("data passed is an array");
            is_array = true;
        }
        else{
            throw "ingredient ids not provided";
        }


        var ingredient_weights;
        var arr_ing_id = new Array();
        if(is_object)
        {
            //making array for query
            console.log("making array for query: data sent is object");
            for (var i = 0; i<ing_ids.length; i++)
            {
                arr_ing_id.push(ing_ids[i].ingredient_id);
            }
        }
        else if(is_array)
        {
            arr_ing_id = ing_ids;
        }
        else throw "you should not be here how did you error after the validation of data";

        console.log("array of ingredient ids for query:\n" + arr_ing_id);

        ingredient_weights = await ingredient_t.findAll({
            attributes: ['ingredient_weight','ingredient_id'],
            where: {
                ingredient_id : {
                    [op.in] : arr_ing_id
                }
            }
        });

        console.log("the weights from ingredients table: \n" + JSON.stringify(ingredient_weights));

        var highest_weight = ingredient_weights[0].ingredient_weight;
        var highest_id = ingredient_weights[0].ingredient_id;
        //find the highest value
        for(var i=1; i<ingredient_weights.length; i++)
        {
            if(ingredient_weights[i].ingredient_weight > highest_weight)
            {
                highest_weight =  ingredient_weights[i].ingredient_weight;
                highest_id = ingredient_weights[i].ingredient_id;
            }
        }
        console.log('highest weight found: \n' +highest_weight +'|'+highest_id );

        //find the ties
        var tied_ids = new Array();
        for(var i=0; i<ingredient_weights.length; i++)
        {
            if(ingredient_weights[i].ingredient_weight == highest_weight)
            {
                tied_ids.push(ingredient_weights[i].ingredient_id);
            }
        }

        //check to see if we have any ties
        if(tied_ids.length >1)
        {
            //if so push the highest id to the tied ids for query
            // tied_ids.push(highest_id);

            //get the amounts of the ingrediets for comparing
            var ing_amounts = await ingrediet_in_pan.findAll({
                attributes: ["ingredient_amount", 'ingredient_id'],
                where: {
                    ingredient_id: {
                        [op.in] : tied_ids
                    }
                }
            });
            console.log("the amounts for comparing\n" + JSON.stringify(ing_amounts));

            highest_amount = ing_amounts[0];
            for(var i=1; i<ing_amounts.length;i++)
            {
                if(highest_amount.ingredient_amount > ing_amounts[i].ingredient_amount)
                {
                    highest_amount = ing_amounts[i];
                }
            }

            console.log("highest amount that we got: \n" + highest_amount)

            id_to_return = highest_amount.ingredient_id;
        }//end of tied checkd
        else
        {
            id_to_return = ingredient_weights[0].ingredient_id;
        }//end of else of the tied ids

        console.log("id that is being returned:\n" + id_to_return);
        return id_to_return;




    }
    catch(err)
    {
        console.log("error in ing_is_greatest: " + err);
        return -1;
    }
}
module.exports.ing_is_greatest =ing_is_greatest;

//test code
// ing_is_greatest([1,3]);

// ing_is_greatest([{
//     ingredient_id: 1
// },
// {
//     ingredient_id: 3
// }])



/*
recipe_is_greatest

desciption:
this fucntion takes a list (array or object) of recipe ids and returns 
the recipe with the highest total weight  among its ingredients
first calles the function wiegh total for each recipe and then finds the 
hightest value among the resule
ties broken by amount of people it feeds

input:
-array/object of recipes

output:
progress to the console

returns:
int id of the recipe
-1 if error
*/

async function recipe_is_greatest(recipe_ids)
{
    //checking data
    // try{
        //flags for how we willdo things
        var is_array = false;
        var is_object = false;
        var id_to_return = -1;
        if(recipe_ids == null)
        {
            throw "no ids provided";
        }
        else if(recipe_ids[0].recipe_id !=null)
        {
            //set flag
            console.log("data passed is an object\n");
            is_object = true;
        }
        else if(Array.isArray(recipe_ids))
        {
            //set flag
            console.log("data passed is an array");
            is_array = true;
        }
        else{
            throw "recipe ids not provided";
        }

        var recipe_weights = new Array();
        var arr_recipe_id = new Array();
        if(is_object)
        {
            console.log("making array for query: data sent was an object\n");
            for(var i = 0; i<recipe_ids.length; i++)
            {
                arr_recipe_id.push(recipe_ids[i].recipe_id);
            }
        }
        else if(is_array)
        {
            arr_recipe_id = recipe_ids;
        }
        else throw "you should not be here how did you error after the validation of data";

        console.log("array of recipes id for query:\n" + arr_recipe_id);

        for(var i = 0; i<arr_recipe_id.length;i++)
        {
            recipe_weights.push(
                {
                    recipe_id : arr_recipe_id[i],
                    recipe_weight : await weight_total(arr_recipe_id[i])
                }
            );
        }

        console.log("the recipe weights: \n" + JSON.stringify(recipe_weights));

        highest_weight = recipe_weights[0];

        //finding the highest weight
        for(var i = 1;i<recipe_weights.length;i++)
        {
            if(highest_weight.recipe_weight < recipe_weights[i].recipe_weight)
                highest_weight = recipe_weights[i];
        }
        //checking for ties
        var ties = new Array();
        for(var i = 0;i<recipe_weights.length; i++)
        {
            if(highest_weight.recipe_weight == recipe_weights[i].recipe_weight)
                ties.push(recipe_weights[i].recipe_id);
        }
        console.log("ties in weight: \n" +JSON.stringify(ties));
        if(ties.length>1)
        {
            //get the recipes feeds number
            var recipes_feeds;

            recipes_feeds = await recipe_t.findAll({
                attributes: ['recipe_id', 'num_people_it_feeds'],
                where: {
                    recipe_id:{
                        [op.in] : ties
                    }
                },
                order: [['num_people_it_feeds' , "DESC"]]
                
            });

            console.log("order of recipe feeds amount: \n" + JSON.stringify(recipes_feeds));
            id_to_return = recipes_feeds[0].recipe_id;
        }
        else{
            id_to_return = highest_weight.recipe_id;
        }

        console.log("recipe id to return: " + id_to_return);
        return id_to_return;




    // }
    // catch(err)
    // {
    //     console.log("error in recipe_is_greatest: \n" + err);
    //     return -1
    // }
}

//test code
recipe_is_greatest([1,2])