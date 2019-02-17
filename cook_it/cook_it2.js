////////////////////////////////////////////////////////////
//this file contains the function cook_it2. cook_it2 takes//
//an int of the recipe id that we are cooking. then it    //
//will check to make sure we can cook the recipe by       //
//checking our inventory for the ingredients if we have   //
//them then we can take out what we are using in the      //
//from the ingredients table from our db.                 //
//UPDATE:                                                 //
//now it will log the number of ingredients you cooked    //
//under your pantry                                       //
////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////
//inputs:
//1.) recipe_id
//2.) pantry_id
//
//outputs: none
//
//datebase updates:
//1.)add # of ingredients cooked to pantry_ingredients_used_month
//2.)add # of ingredients cooded to pantry_ingredients_used_YTD