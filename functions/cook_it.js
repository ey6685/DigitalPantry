//////////////////////////////////////////////////////////
//this file contains the function cook_it. cook_it takes//
//an int of the recipe id that we are cooking. then it  //
//will check to make sure we can cook the recipe by     //
//checking our inventory for the ingredients if we have //
//them then we can take out what we are using in the    //
//from the ingredients table from our db.               //
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//created by: patrick veltri                            //
//last updated: patrick 02/04/2019                      //
//changes                                               //
//1.)created                                            //
//2.)made basic algorithm as describe above             //
//////////////////////////////////////////////////////////


//////////////////requires////////////////////////////////
// const mysql = require('mysql');

//basic query handles
const ingredients_in_recipe = require('../DB_models/recipe_ingredient');
const ingredients_t = require('../DB_models/Ingredients');
const op = require('sequelize').Op;

//set up my db connection
// const db = mysql.createConnection ({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'digital_pantry',
//     multipleStatements:true//may have to change this later for security.....(note for OSKARS)
// });


///////////////start of the cook it function//////////////
async function cook_it(recipe_id)
{
    try{
    console.log("INSIDE COOK IT");
    ingredients_id_array = new Array();// used in the query for ingredients
    new_inv              = new Array();//used to keep track of the new amount to store in DB 
   
   
    //query
    //select * from recipe_ingredients 
    //where
    //recipe_id = 'recipe_id';
    var IiR_results = await ingredients_in_recipe.findAll({
        where: {recipe_id: recipe_id}
    });

    console.log("INSIDE COOK IT FIRST THEN");

    IiR_results.forEach(index=>{
        // console.log(index.ingredient_id)
        ingredients_id_array.push(index.ingredient_id);
    });

    //query
    //select * from ingredients
    //where
    //ingredient_id
    let ingredient_results = await ingredients_t.findAll({
        where:{ ingredient_id: {[op.in]: ingredients_id_array}}
    })
    console.log("INSIDE COOK IT SECOND THEN");
    //now that we have the data that we are looking at
    //we need to check our inventory for the ingredients


    flag_can_cook =true;//flip if we cant cook the food. most likey due to an ingredteitn not being in stock
    
    //loop through and match the ids so we can find if we have it
    //if we have it log the differece in the total
    for(var i=0; i< ingredient_results.length; i++)
    {
        // console.log("outer for:" + (i+1));
        for(var o=0;o < IiR_results.length; o++)
        {
            
            
            if(IiR_results[o].ingredient_id == ingredient_results[i].ingredient_id)
            {
                                        
                if(IiR_results[i].recipe_ingredient_qty <= ingredient_results[o].ingredient_total || ingredient_results[o].ingredient_total == null)
                    {
                        //now that we have match the ids of the ingredients and that we have it log 
                        //the differcne in new_nav by pushing it on to that array

                        new_inv.push(ingredient_results[i].ingredient_total - IiR_results[o].recipe_ingredient_qty);
                        //stop this iteration of the loop
                        break;
                    }
                    else
                    {
                        //send to the console that the flag was fipped
                        ////////////////NOTE/////////////////////////
                        //we may want to make this error render to //
                        //the page later if you guys want. for p2? //
                        //maybe?                                   //
                        /////////////////////////////////////////////
                        console.log("flag fipped: canNOT cook");
                        flag_can_cook = false;
                    }
            }//end of id check

        }//end of nested for

    }//end of outer for
    console.log(flag_can_cook);
    if(flag_can_cook)
    {
        //now that we have the ingredients in the inv and have the differice in what we have and what we
        //need stored in new_inv 
        //noramlly i would of used sequlized but i needed to update more than one
        //row at a time and it was just easiery to build the query string and send it as
        //raw sql
        //therefore the next block of code is just bulding the string
        //if the inv is 0 we also change the expritation date to null to 
        //to take it out of the inv for later finding the next expiring ing
        let query_str = "";

        if(ingredients_id_array.length == new_inv.length)
        {
            for(let i = 0; i<ingredients_id_array.length; i++)
            {
                if(new_inv>0)
                {
                    query_str += "UPDATE ingredients SET ingredient_total = " + new_inv[i] + " WHERE ingredient_id = " + ingredients_id_array[i] + "'; ";
                }else
                {
                    query_str += "UPDATE ingredients SET ingredient_total = 0, ingredient_expiration_date = null WHERE ingredient_id = " + ingredients_id_array[i] + "; ";
                    new_inv[i] = null;
                }
            }
            let promise = db.query(query_str,(err,result) =>{
                if(err) throw err;
                console.log("queryed db success");
                }

            );
            var something = promise;
            return promise;
            
        }
        else
        {
            console.log("Opps something went wrong!");
        }
    }
}
catch(e){
    console.log(e);
}

}

module.exports.cook_it = cook_it;
///////this line was used for testing.
//the function is trying to cook recipe
//2 that in our dummy data is chicken soup
//cook_it(2);