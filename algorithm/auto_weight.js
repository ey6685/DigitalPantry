
//this file contains the function to scan names of ingredients and auto assign weight to indredients.
//if the auto assign is wrong the user may edit the weight with the editing functions

//inputs
//1) string: name


//return
//int: weight
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
        //weight 1 buzz word
        if(
            (name.includes("FROZEN"))
            ||//or
            (name.includes("CANNED"))
            ||//or
            (name.includes("CAN"))
            ||//or
            (name.includes("GROUND PEPPER"))
            ||//or
            (name.includes("BROTH"))
            ||//or
            (name.includes("STOCK"))
            ||//or
            (name.includes("PICKEL"))
          )//then
        {
            console.log("weight assigned: 1");
            return 1;
        }

    //weight 2    
    else if(
            (name.includes("CARROT"))
            ||//or
            (name.includes("CELERY"))
            ||//or
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
        ||//or
        (name.includes("TURKEY"))
        ||//or
        (name.includes("BREAST"))
        ||//or
        (name.includes("BEEF"))
        ||//or
        //SEAFOOD
        (name.includes("FISH"))
        ||//or
        (name.includes("SALMON"))
        ||//or
        (name.includes("COD"))
        ||//or
        //FRESH FRUIT
        (name.includes("BANANA"))
        ||//or
        (name.includes("APPLE"))
        ||//or
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
