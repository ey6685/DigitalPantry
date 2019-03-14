/*
this file contains the function to scan names of ingredients and auto assign wieght to indredients.
if the auto assign is wrong the user may edit the wieght with the editing functions

inputs
1) string: name

outputs

return
int: wieght

requires
*/

function auto_wieght(name)
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
            console.log("wieght assigned: 1");
            return 1;
        }

    //wieght 2    
    else if(
            (name.includes("CARROT"))
            ||
            (name.includes("CELERY"))
            ||
            (name.includes("CUCUMBERS"))
           )//then
        {
            console.log("wieght assigned: 2");
            return 2;
        }
    //wieght 3
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
        console.log("wieght assigned: 3");
        return 3;
    }
    else
    {
        console.log("no keywords found!");   
        console.log("wieght assigned: 1");
        return 1;
    }
    
}

module.exports.auto_wieght = auto_wieght;
