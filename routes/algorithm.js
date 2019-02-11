///////////////////////////////////////////////////////////////////////////// 
//basic algorithm for selecting recipes that have                          // 
//soon to be expired ingredients that the pantry                           // 
//has stored                                                               // 
///////////////////////////////////////////////////////////////////////////// 
 
///////////////////////version info////////////////////////////////////////// 
//v0.1 just finds the first expirin ingredient and finds the recipes its in// 
///////////////////////////////////////////////////////////////////////////// 
 
//////////////////////requires//////////////////////////////////////////////// 
const express = require('express');                                          
const router = express.Router();                                             
 
//the link to the ingredients table from them mysql database 
const ingredients = require('../DB_models/Ingredients'); 
 
//link to the recipe_ingrdient table 
const recipe_ingredient = require('../DB_models/recipe_ingredient'); 
 
//link to the recipes table 
const recipes = require('../DB_models/Recipes'); 
 
//sequelized comparasine handler 
const sequelized = require('sequelize'); 
const op = sequelized.Op; //this does the handling 
//web reference: http://docs.sequelizejs.com/manual/tutorial/models-usage.html 
///////////////end of requires///////////////////////////////////////////////// 
 
 
 
 
///////////////////////start of algor:direct//////////////////////////////// 
 
 
//router.get is how we route her 
//just useed for testing we can change this at anytime 
async function directAlgorithm(){
	////////////////////////////////////////////////////////////////// 
    //this is for most direct algorithm to find the item at the top/// 
    //of the list of expiring items and suggest the recipes        /// 
    //after finding the recipes double check that we have the      /// 
    //ingredients in our pantry. if we do then send to the user that// 
    //we can cook                                                   // 
	////////////////////////////////////////////////////////////////// 
 
 
	//query the data base for all the ingredients 
	//doing it allhere so i can check the inventory later 
 
	///////////////////////////// 
	//SELECT * FROM ingredients// 
	///////////////////////////// 
	try{
		let ingredients_result = await ingredients.findAll({
			where: {
				ingredient_total:{
					[op.ne]:0
				}
			},
			raw: true
		});
	
			//get the data stored 
	
			//set up the min values for finding the closest date 
			closest_date =  ingredients_result[0].ingredient_expiration_date; 
			closest_id = ingredients_result[0].ingredient_id; 
	
			//loop through the table and the ingrediend id of the ingredient that is 
			//expiring next  
			///////////////////////////LATER///////////////////////////////// 
			///for later we can edit the snippet to check if the data is   // 
			///less then a set date, then add it to a table.               // 
			///////////////////////////////////////////////////////////////// 
			ingredients_result.forEach(current =>{ 
	
				if(current.ingredient_expiration_date < closest_date) 
				{ 
					closest_date = current.ingredient_expiration_date; 
					closest_id   = current.ingredient_id; 
				} 
			})//end of forEach that checks the next expiring item 
	
		
			//now that we know what is expiring then we need to find a recipe that we can cook with it 
			//first lets get the data 
			
			//////////////////////////////////////////////////////////////////// 
			//select * from recipe_ingredient where ingredient_id = closest_id// 
			//////////////////////////////////////////////////////////////////// 
			let recipe_ingrdient_result = await recipe_ingredient.findAll({ // <------- CHANGE IS HERE
				where: {},
				raw: true
			});
				//////////////////////////////////////////////////////////////////////	 
				//check out the recipe_ingredient table for matching ingredient id's// 
				//when found store the recipe_id in the potential_recipe_ids.       // 
				//later in this .then we will check the potentials against our inv  // 
				////////////////////////////////////////////////////////////////////// 
	
				let count = 0; 
				let potential_recipe_ids = new Array(); 
				let suggested_recipes = new Array(); 
				recipe_ingrdient_result.forEach(current =>			 
				{ 
					if(closest_id ==current.ingredient_id) 
					{ 
						//check to see if the ingredient is in a recipe 
						//if it is increment count and store its recipe id 
						count++; 
						potential_recipe_ids.push(current.recipe_id); 
					} 
				}) 
				
				//we found no recipes. :'( 
				if( count == 0) 
				////////////////////////LATER///////////////////// 
				///change this output to display on the page in/// 
				////////////////////////////////////////////////// 
				{ 
					res.send("there is no recipes for your next expiring ingredients :(")
				} 
				
				//if we found 1+ recipes 
				//now we need to check if we have all the ingredients for each recipe 
				else if (count >= 1) 
				{ 
					
					let Ingredient_length = ingredients_result.length; //we will use this later. 
					
					//take the potential_recipe_ids and find all the ingrediends 
					potential_recipe_ids.forEach(currentPRID=>{ 
						do_we_have_everything = true//flip if we dont have the ingredient needed 
						recipe_ingrdient_result.forEach(currentREC_ING=>{ 
							
						//check to see if they match 
						if(currentPRID == currentREC_ING.recipe_id) 
							{ 
								//when they match loop through the ingredients 
								let i =0; 
								//loop condition. break if we finsh the list or if we dont have the ingredient 
								while(i<Ingredient_length && do_we_have_everything) 
								{ 
									//find the ingredient from the table 
									if(currentREC_ING.ingredient_id == ingredients_result[i].ingredient_id) 
									{ 
										//check if we have enough 
										if(currentREC_ING.recipe_ingrdient_qty > ingredients_result[i].ingredient_total) 
										{ 
											do_we_have_everything = false; 
										} 
									} 
									i++; 
								} 
							} 
	
							
						}) 
					
						if(do_we_have_everything) suggested_recipes.push(currentPRID); 
					})//end of for eaches 
					
						//make sure there is at least 1 recipe we can make 
						if(suggested_recipes.length)  
							{ 
								let recipes_result = await recipes.findAll({ // <------- CHANGE IS HERE
									where: {
										recipe_id: {
											[op.in]: suggested_recipes
										}
									}
								})
									someinfo = recipes_result;
									return someinfo;
							} 
				}//end ofthe if's 
			//end of recipe_ing promise 
		//end of ingredients promise	 
			}
			catch(err)
			{
				res.send("<h1>ERROR:" + err +"</h1><br><h2>please hit the browser's back button and reload the page.<br>if this is the 2nd time you are here please contact your systems admin and inform them of the error.</h2><br><h3>have a nice day user:)");
			}
}//end of router function 

module.exports = router;
module.exports.directAlgorithm = directAlgorithm;