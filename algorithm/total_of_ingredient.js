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
const op = require('sequelize').Op;
 
async function total_ingredients(ing_id, pantry_id,unit) 
{ 
    try 
    {    
        //get todays date from the users system
        var today = new Date();
        console.log("\n\nstarting to total ingredient with id: " + ing_id +" in unit: " + unit + '\n\n');
        //get all the ingredients in the the pantry stock 
        var the_stock = await ingredient_t.findAll({ 
            attributes: ["ingredient_amount", "ingredient_unit_of_measurement"], 
            where:{ 
                ingredient_id: ing_id, 
                pantry_id: pantry_id ,
                ingredient_expiration_date:{
                    [op.or] : [null,{[op.gte] : today}]
                }
            } 
        }); 
        console.log("the_stock")
        console.log("===========")
        console.log(JSON.stringify(the_stock)); 
        //time to total 
        var sum = 0.0; 
        for(var i = 0; i< the_stock.length;i++)
        { 
            // the ingredient unit is the same just add it to the total
            if(unit == the_stock[i].ingredient_unit_of_measurement) 
            { 
                sum += the_stock[i].ingredient_amount; 
            } 
            else 
            { 
                //convert it to the new unit
                var new_num = await parseFloat(unit_convert.converter_raw(the_stock[i].ingredient_amount, the_stock[i].ingredient_unit_of_measurement, unit)); 
                //add to sum
                sum += new_num; 
            } 
        } 
        //log it for debuging
        console.log("\nsum: " +sum + '\n'); 
        return sum; 
 
    } 
    catch(err) 
    {   
        // if an error happens return 0
        console.log(err); 
        return 0
    } 
} 
 
module.exports.total_ingredients= total_ingredients;

