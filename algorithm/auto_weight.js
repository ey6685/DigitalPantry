/*
this file contains the function to scan names of ingredients and auto assign weight to indredients.
if the auto assign is wrong the user may edit the weight with the editing functions

inputs
1) string: name

outputs

return
int: weight

requires
*/

function auto_weight(name)
{
    //data valadations
        if(name == null)
        {
            console.log("no name provided returning -1")
            return -1
        }
        //make it upper case
        name = name.toUpperCase();

        console.log(name);
        //weght 1 buzz word
        if(
            (name.includes("FROZEN"))
            ||
            (name.includes("CANNED"))
            ||
            (name.includes("CAN"))
            ||
            (name.includes("GROUND PEPPER"))
            ||
            (name.includes("BROTH"))
            ||
            (name.includes("STOCK"))
            ||
            (name.includes("PICKEL"))
          )//then
        {
            console.log("weight assigned: 1");
            return 1;
        }

    //weight 2    
    else if(
            (name.includes("CARROT"))
            ||
            (name.includes("CELERY"))
            ||
            (name.includes("CUCUMBERS"))
           )//then
        {
            console.log("weight assigned: 2");
            return 2;
        }
    //weight 3
    else if(
        //MEATS
        //includes
        (name.includes("CHICKEN"))
        ||
        (name.includes("TURKEY"))
        ||
        (name.includes("BREAST"))
        ||
        (name.includes("BEEF"))
        ||
        //SEAFOOD
        (name.includes("FISH"))
        ||
        (name.includes("SALMON"))
        ||
        (name.includes("COD"))
        ||
        //FRESH FRUIT
        (name.includes("BANANA"))
        ||
        (name.includes("APPLE"))
        ||
        (name.includes("FRUIT"))
    )//THEN
    {
        console.log("weight assigned: 3");
        return 3;
    }
    else
    {
        console.log("no keywords found!");   
        console.log("weight assigned: 1");
        return 1;
    }
    
}

module.exports.auto_weight = auto_weight;
