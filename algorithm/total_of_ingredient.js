/* 
this file is to calc the total amount of an ingredient with a certain unit of 
measurement. 
steps: 
1)check input 
2)query db for the ingredient with the id that was inputed 
3)total all the amounts 
--convert if needed 
4)return total 
 
 
inputs 
--ingredient id 
--pantry id 
--unit of measurement we need to use for comparing 
 
outputs 
--float of the total ingrednients 
 
requires*/ 
const ingredient_t = require('../DB_models/ingredients_in_pantry'); 
const unit_convert = require('./Convert_unts'); 
 
async function total_ingredients(ing_id, pantry_id,unit) 
{ 
    try 
    {    
        //get all the ingredients in the the pantry stock 
        var the_stock = await ingredient_t.findAll({ 
            attributes: ["ingredient_amount", "ingredient_unit_of_measurement"], 
            where:{ 
                ingredient_id: ing_id, 
                pantry_id: pantry_id 
            } 
        }); 
 
        console.log(JSON.stringify(the_stock)); 
        //time to total 
        var sum = 0.0; 
        the_stock.forEach(async function(current) { 
            if(unit == current.ingredient_unit_of_measurement) 
            { 
                sum += current.ingredient_amount; 
            } 
            else 
            { 
                var new_num = await parseFloat(unit_convert.converter_raw(current.ingredient_amount, current.ingredient_unit_of_measurement, unit)); 
                sum += new_num; 
            } 
        }); 
 
        console.log("\nsum: " +sum + '\n'); 
        return sum; 
 
    } 
    catch(err) 
    { 
        console.log(err); 
    } 
} 
 
module.exports.total_ingredients= total_ingredients;