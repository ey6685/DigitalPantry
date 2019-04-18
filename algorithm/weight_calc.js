/*
this fill contaions two wieght calculators: one for the ingredeints and the other for recipe


ingredeient formula

ingredient amount * size mod
============================  * wieght
days till ingredient exipe


recipe formula

total ingredients weight
========================
lowest number of days
*/

//requires
const recipe_table = require('../DB_models/Recipes');
const ingredient_table = require("../DB_models/Ingredients");
const ingredient_in_recipe = require("../DB_models/ingredients_in_a_recipe");
const ingredient_in_pantry = require("../DB_models/ingredients_in_pantry");
const converter = require('./Convert_unts');
const op = require('sequelize').Op;

//some constants
const ONE_DAY = 1000 * 60 * 60 * 24;

///change this page globle to fit the needs of weight comparions 
///it should be changed to a unit that can be uniserally converted to
const UNIVERSAL_UNIT = 'cup';
/*
ingredient()

inputes
1)pantry id: int
2)ingredient id: int

output
1)weight = calulated by formulas

returns
float(0.00) of weight
0 if err

desciption
first validates data sent to it is correct. then querys the ingredient table for the weight of said ingredient id. after that
query the ingredients in pantry table for all the ingredients that are curretly in  the pantry. after that run each through the forula and total them up

return the value
*/





//////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function ingredient(ingredient_id,pantry_id)
{
    console.log("starting ingredient weight calulation with id: " + ingredient_id + "\n===========================================\n")
    //hello this is data, and i just sent you, validate maybe?
    //pantry id
    if(pantry_id == null)
    {
        console.log("no pantry_d\n==========\n");
        return 0;
    }
    else if(typeof pantry_id != "number")
    {
        console.log("pantry id: "+ pantry_id + " not a number\n========================");
        return 0 ;
    }

    //ingredinet id
    if(ingredient_id == null)
    {
        console.log("no ingredient id\n===============\n")
        return 0;
    }
    else if(typeof ingredient_id != "number"){
        console.log("ingredient id " + ingredient_id + " is not a number\n================================================\n");
        return 0;
    }

    //data good then lets get started
    //var declarations
    var today = new Date();//today
    today = today.getTime();//set it to ms
    var sum = 0.0;
    console.log("todays date: " + today + " MS \n=============================");
    console.log("\nquerying the db\n===============");
    try{
        //grab the weight for from the ingredients table
            var ingredient_weight_factor = await ingredient_table.findOne({
            attributes : ["ingredient_weight"],
            where :{
                ingredient_id: ingredient_id
                
            }
        });
        //greb the rest of the ingredient data
        var ingredient_list = await ingredient_in_pantry.findAll({
            where :{
                ingredient_id: ingredient_id,
                ingredient_expiration_date: {
                    [op.gte] : today
                }
            }
        });
        console.log("\n\nData Recived\n=============")
        console.log("The weight Fator: " + ingredient_weight_factor.ingredient_weight + "\nlist of ingredient data: " + JSON.stringify(ingredient_list) );

        //now all the data is here for the db
        
        console.log("\nSTARTING FOR LOOP\n=================")
        for(var i=0; i< ingredient_list.length; i++)
        {
            console.log("\nLOOP NUMBER: " + i+ "\n============")
            var later_date = new Date(ingredient_list[i].ingredient_expiration_date);
            later_date = later_date.getTime();

            var days = later_date - today;
            days = Math.round(days/ONE_DAY) +1; //rounding always goes down.
            //console.log(days);

            //now we need to convert the amount to cups
            //NOTE: with the current measurements(as of mar) cup have the most clean converivers
            var ingredient_con_amount;
            if(ingredient_list[i].ingredient_unit_of_measurement == "cup")
            {
                ingredient_con_amount = ingredient_list[i].ingredient_amount;
            }
            else{
                ingredient_con_amount = await converter.converter_raw(ingredient_list[i].ingredient_amount, ingredient_list[i].ingredient_unit_of_measurement, UNIVERSAL_UNIT);
            }
            console.log("FORULA DATA\n============");
            console.log("ingredient amount: " + ingredient_con_amount + " in " + UNIVERSAL_UNIT +"s");
            console.log("number of days till exipre: " + days + " Day(s)");
            console.log("weight fator: " + ingredient_weight_factor.ingredient_weight);

            console.log("\nFORMUlA:\n==========");
            console.log(ingredient_con_amount);
            console.log("-------- X " + ingredient_weight_factor.ingredient_weight);
            console.log( days);

            var result = parseFloat( parseFloat((ingredient_con_amount / days) * ingredient_weight_factor.ingredient_weight).toFixed(2));
            console.log("\nFORMULA RESULT: " + result + "\n=============================");
            sum += result;

            console.log("CURRENT SUM: " + sum + "\n=====================")
        }
        console.log("\nDONE WITH INGREDIENT: " + ingredient_id + " CALCULATIONS\n===================================\n");
        return sum;
    }
    catch(err) 
    {
        console.log(err);
        return 0;
    }
}
module.exports.ingredient = ingredient
//test code for ingredient
//ingredient(1,1);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*just one ingredient now
same as the fuction above bit just for one specific item in the pantry and not all of them as a whole

*/
async function just_one(ingredient_id,pantry_id)
{
    console.log("starting ingredient weight calulation with id: " + ingredient_id + "\n===========================================\n")
    //hello this is data, and i just sent you, validate maybe?
    //pantry id
    if(pantry_id == null)
    {
        console.log("no pantry_d\n==========\n");
        return 0;
    }
    else if(typeof pantry_id != "number")
    {
        console.log("pantry id: "+ pantry_id + " not a number\n========================");
        return 0 ;
    }

    //ingredinet id
    if(ingredient_id == null)
    {
        console.log("no ingredient id\n===============\n")
        return 0;
    }
    else if(typeof ingredient_id != "number"){
        console.log("ingredient id " + ingredient_id + " is not a number\n================================================\n");
        return 0;
    }

    //data good then lets get started
    //var declarations)
    var today = new Date()
    today = today.getTime()
    
    console.log("todays date: " + today + " MS \n=============================");
    console.log("\nquerying the db\n===============");
    try{
        var the_ingrdrient = await ingredient_in_pantry.findOne({
            where:{
                ingredient_id: ingredient_id,
                ingredient_expiration_date: {
                    [op.gte] :today
                }
            },
            order : ["ingredient_expiration_date"]
        })
        console.log("data recived")
        console.log("============")
        console.log(JSON.stringify(the_ingrdrient))

        //now for the fromula
        //first to the cups
        var ingredient_con_amount;
        var days
            if(the_ingrdrient.ingredient_unit_of_measurement == "cup")
            {
                ingredient_con_amount = the_ingrdrient.ingredient_amount;
            }
            else{
                ingredient_con_amount = await converter.converter_raw(the_ingrdrient.ingredient_amount, the_ingrdrient.ingredient_unit_of_measurement, UNIVERSAL_UNIT);
            }
            //now the number of days
            var later_date = new Date(the_ingrdrient.ingredient_expiration_date)
            later_date = later_date.getTime()
            days = Math.round((later_date-today) / ONE_DAY) +1
            console.log("number of days till exp: " + days)
            console.log("================================")

            console.log("formula data:")
            console.log("=============")
            console.log("amount of ingredient in cups :" +ingredient_con_amount)
            console.log("number of days till death: " +days)
            //noe the calc and store it into the var wieght
            
            weight = parseFloat(ingredient_con_amount/days)

            console.log("weight")
            console.log("======")
            console.log(weight)

            return weight;
    }
    catch(e){
        console.log(e)
        return 0
    }
}

//test code
//just_one(16,1)
module.exports.just_one = just_one
///////////////////////////////////////////////////////////////////////////////////////////////////
/*

///this funtion was left in the code for future sen projects
recipe()

inputs:
1)recipe id : int
2)pantry id : int

output
1)total of all the ingredients weights for the recipe for a total weight for the recipe
2)stuff to the console for debugging and demo purposes

returns
float(2) of the total ingredietn weights
0 if error

desciption:
the function takes a recipe id and and pantry id, makes sure they are valid.
after checking the data query the ingredients in a recipe table for the ingredindeds for totaling
then with a for loop send all the ingredient ids into the ingredient weight calc(ingrediet() from above).
then totals them all up and sends it back to what called it 
return sum
*/

async function recipe(recipe_id, pantry_id)
{
    console.log("\nSTARTING RECIPE WIEGHT TOTAL CALUCLATIONS WITH RECIPE ID: " + recipe_id);
    console.log("============================================================");

    //valid data? i hope so
    //recipe data
    if(recipe_id == null)
    {
        console.log("NO recipe id");
        console.log("============");
        return 0;
    }
    else if(typeof recipe_id != 'number')
    {
        console.log("recipe id is NOT a number");
        console.log("=========================");
        return 0;
    }
    
    //pantry id
    if(pantry_id == null)
    {
        console.log("NO pantry id");
        console.log("============");
        return 0;
    }
    else if (typeof pantry_id != "number")
    {
        console.log("pantry id is NOT a number");
        console.log("=========================");
        return 0;
    }

    //data good? great now to the caluclations
    var sum = 0.0;

    //query data
    console.log("\nQuery ingredients_in_a_recipe table for ingredients to total");
    console.log("============================================================");
    try{
        var ingredient_list = await ingredient_in_recipe.findAll({
            attributes: ["ingredient_id"],
            where:{
                recipe_id: recipe_id
            }
        });

        console.log("\nIngredients needed");
        console.log("==================");
        console.log(JSON.stringify(ingredient_list));

        //now that we have the ingredient ids we just need to loop thrrought them and send them to the ingredient weight calc
        //and total them up.
        //RIP console 

        for(var i=0;i<ingredient_list.length;i++)
        {
            console.log("LOOP NUMBER: " + i);
            console.log("=================\n");

            sum += await ingredient(ingredient_list[i].ingredient_id,pantry_id);

            console.log("current sum: " + sum);
            console.log("===================");
        }

        console.log("====================")
        console.log("RECIPE " + recipe_id +" WEIGHT: " + sum)
        console.log("====================")

        return sum;

    }
    catch(err)
    {
        console.log(err);
        return 0;
    }

}
module.exports.recipe= recipe
//testing code for recipes
//recipe(2,1);