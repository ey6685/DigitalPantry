/*
File: Convert_units
Created by: Patrick Veltri

inputs:
1)# to be converted
2)what unit it is in
3)what it needs to be converted to

outputs:

returns:
1)float of the # passed to this function that has been converted to 
2)0 if can not convert
*/

/////requires////
const ing_t = require('../DB_models/Ingredients');

async function Converter(num, unit, con_unit)
{
    try{
        //checking data
        if(num == null) throw "need num";

        if(unit == null) throw "need First unit";
        else if(typeof unit != "string") throw "need string input for first unit";

        if(con_unit == null) throw "need to convert to";
        else if(typeof con_unit != "string") throw "need a string input";

        if(unit == con_unit) return num;
        ///done checking data
        
        //now to check if we can convert the units
        //aka if a unit is for a liquid or not
        if(unit == "tsp." || unit == "tbsp." || unit == "cup")
        {
            ///these can go both ways so just convert here

            switch(unit){
                case "tsp.":
                    if(con_unit == "tbsp")       return (num * 3);
                   
                    else if(con_unit == "cup")   return (num * 0.0208333333);

                    else if(con_unit == "lb")    return (num * 0.013);

                    else if(con_unit == "oz")    return(num / 6.0);

                    else if(con_unit == "fl oz") return (num * 0.166667);

                    else if(con_unit == "ml")    return (num * 4.92893145135984);

                    else if(con_unit == "quart") return (num *0.0043368533850934223167);

                    else return 0;
                    break;

                case "tbsp.":
                    if(con_unit == "tsp.")                           return (num / 3.0);

                    else if(con_unit =="cup")                        return (num / 16.0);

                    else if(con_unit == "lb")                        return (num / 32.0);

                    else if(con_unit == "oz" || con_unit == "fl oz") return (num / 2.0);

                    else if(con_unit == "ml")                        return (num *  14.7867648);

                    else if(con_unit == "quart")                     return (num *  0.015625);

                    else                                             return 0;

                    break;

                case "cup": 
                    if(con_unit == "tsp.")  return (num *48);

                    else if(con_unit == "tbsp.") return (num * 16);

                    else if(con_unit == "lb")  return (num * 0.5);

                    else if(con_unit == "oz" || con_unit == "fl oz") return (num * 8);

                    else if(con_unit == "ml") return (num * 236.588237);

                    else if(con_unit == "quart") return (num *0.25); 

                    else return 0;

                    break;

                   
            }

        }
        else if(unit == "lb" || unit == "oz")
        {
            //put in the universals from above
            if(unit == "lb" && con_unit == "oz")
            {
                return (num * 16);
            }
            else if(unit == "oz" && con_unit == "lb")
            {//make sure this doesnet do int math int math bad
                return (num / 16.0);
            }
            else
            {
                return 0;
            }
            //dry or solid food
        }
        else if(unit == "fl oz" || unit == "ml" || unit == "quart")
        {
            //liquid food
            switch(unit){
                case "fl oz":
                    if(con_unit =="ml") return (num * 29.5735);

                    if(con_unit == "quart") return (num * 0.03125);

            }
        }
        else
        {
            //return error 
            return 0;

        }
    }
    catch(err)
    {
        console.log(err);
        return 0;
    }
}


Converter();
