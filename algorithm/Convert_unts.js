
//File: Convert_units
//Created by: Patrick Veltri



/////////////////////////////////////////////////////////////////////////////////////
//Function 1: converter raw

//inputs:
//1)# to be converted
//2)what unit it is in
//3)what it needs to be converted to
//returns:
//1)float of the # passed to this function that has been converted to
//2)0 if can not convert

//descrition:
//after checking to make sure allthe data is there,give a raw double to ofa conversion
//of the unit. NOTE this is for db checking.
//////NOT//////
/////FOR//////
/////FRONT////
////END//////
//The second funtion in this file is for the front end


/////requires////
const logger = require('../functions/logger');
function converter_raw(num, unit, con_unit) {
  //num is the amount of the food we are trying to convert
  //unit is what it is measured in
  //con_unit is the unit we are coverting to
  try {
    // checking data
    if (num == null) throw 'need num';

    if (unit == null) throw 'need First unit';
    else if (typeof unit != 'string') throw 'need string input for first unit';

    if (con_unit == null) throw 'need to convert to';
    else if (typeof con_unit != 'string') throw 'need a string input';

    if (unit == con_unit) return num;

    if(unit == null || con_unit == null) 
    {
      logger.info("water, most likely\n");
      return num;
    }
    //return the num sent in if the unit and the convert unit are the some
    if(unit == con_unit)
    {
      return num;
    }
      
    ///done checking data
  logger.info("coverting " +num+" " + unit + " to " + con_unit +'\n');
  //now to check if we can convert the units

  ///these can go both ways so just convert here

// now to check if we can convert the units
    // aka if a unit is for a liquid or not
    if (unit == 'tsp.' || unit == 'tbsp.' || unit == 'cup') {
      // these can go both ways so just convert here

      switch (unit) {
        case 'tsp.':
          if (con_unit == 'tbsp.') return num / 3.0;
          else if (con_unit == 'cup') return num * 0.0208333333;
          else if (con_unit == 'lb') return num * 0.013;
          else if (con_unit == 'oz') return num / 6.0;
          else if (con_unit == 'fl oz') return num * 0.166667;
          else if (con_unit == 'ml') return num * 4.92893145135984;
          else if (con_unit == 'quart') return num * 0.0043368533850934223167;
          else return 0;
          break;

        case 'tbsp.':
          if (con_unit == 'tsp.') return num * 3.0;
          else if (con_unit == 'cup') return num / 16.0;
          else if (con_unit == 'lb') return num / 32.0;
          else if (con_unit == 'oz' || con_unit == 'fl oz') return num / 2.0;
          else if (con_unit == 'ml') return num * 14.7867648;
          else if (con_unit == 'quart') return num * 0.015625;
          else return 0;

          break;

        case 'cup':
          if (con_unit == 'tsp.') return num * 48;
          else if (con_unit == 'tbsp.') return num * 16;
          else if (con_unit == 'lb') return num * 0.5;
          else if (con_unit == 'oz' || con_unit == 'fl oz') return num * 8;
          else if (con_unit == 'ml') return num * 236.588237;
          else if (con_unit == 'quart') return num * 0.25;
          else return 0;

          break;


                case "tbsp.":
                    if(con_unit == "tsp.")                           return (num * 3.0);

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

                default:
                    return 0;
                    break;
            }

        }
        else if(unit == "lb" || unit == "oz")
        {
            //put in the universals from above
            if(unit == "lb" && con_unit == "oz")
            {
                logger.info((num * 16) + '\n');
                return (num * 16);
            }
            else if(unit == "oz" && con_unit == "lb")
            {
                return (num / 16.0);
            }
            else
            {
              switch(unit){
                case "oz":
                  if(con_unit == "tsp.") return(num * 6);
                  else if(con_unit == "tbsp.") return (num *2);
                  else if(con_unit == "fl oz") return (num);
                  else if(con_unit == "cup") return (num *0.125);
                  else if(con_unit == "ml") return (num *29.5735);
                  break;
                case "lb":
                  if (con_unit== "tsp.") return(num *96);
                  else if(con_unit == "tbsp.") return (num *32);
                  else if(con_unit == "fl oz") return (num *16 );
                  else if(con_unit == "cup") return (num *2);
                  else if(con_unit == "ml") return (num *29.5735);
                  else return 0;
                  break;

              }

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

                    else if(con_unit == "quart") return (num * 0.03125);

                    else if(con_unit == "tsp.") return (num * 6);

                    else if(con_unit == "tbsp.") return (num * 2);

                    else if(con_unit == "cup") return (num * 8.115);

                    else return 0;
                    break;
                case "ml":
                    if(con_unit == "tsp.") return (num * 0.202884);
                    else if(con_unit == "tbsp.") return(num *0.067628);
                    else if (con_unit == "fl oz" || con_unit == "oz") return (num * 0.033814);
                    else if(con_unit == "cup") return (num * 0.00416667);
                    else if(con_unit == "lb") return (num *0.00416667 * 0.5); //to cup then cup to lb
                    else return 0;
                    break;
                case "quart":
                  if(con_unit == "tsp.") return (num *192);
                  else if(con_unit == "tbsp.") return(num *64);
                  else if(con_unit.includes("oz")) return (num * 32);
                  else if(con_unit == "cup") return (num * 3.94314);
                  else if(con_unit == "ml") return(num *946.353);
                  else if(con_unit == "lb") return(num *3.94314 *0.5 ); //to cup then to lb
                  else return 0;

            }
        }
        else
        {
            //return error 
            return 0;

        }
    }
  
   catch (err) {
    logger.info(err);
    return 0;
  }
}
module.exports.converter_raw = converter_raw;
/////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
/*
function 2: converter_whole

inputs:
1)number to covert
2)that numbers unit
3)unit to covert to

returns:2d array
====================
|int | larger unit |
====================
|int | smaller unit|
====================

/////or///////
just a converted number if the covert is less than 1 or converted to a whole number
*/

async function converter_whole(num, unit, con_unit) {
  try {
    // checking data
    if (num == null) throw 'need num';

    if (unit == null) throw 'need First unit';
    else if (typeof unit != 'string') throw 'need string input for first unit';

    if (con_unit == null) throw 'need to convert to';
    else if (typeof con_unit != 'string') throw 'need a string input';

    if (unit == con_unit) return num;
    // done checking data

    var converted_num = await converter_raw(num, unit, con_unit);

    // check if converter_raw came back bad
    if (converted_num == 0) throw 'converter_raw fail';
    else if (converted_num < 1) return parseFloat(converted_num).toFixed(2); // keep it to two descible points

    logger.info('raw: ' + converted_num + con_unit + '\n');

    // take the raw convert into two parts
    // the whole and the decibel
    var whole_part = await parseInt(converted_num);
    var decibel_part = converted_num - whole_part;

    // if no need to convert decibel part.
    if (decibel_part == 0) return whole_part;
    // logger.info('whole: ' + whole_part + "\ndeci: " + decibel_part);

    decibel_part = await parseFloat(
      parseFloat(converter_raw(decibel_part, con_unit, unit)).toFixed(1)
    );

    // logger.info(decibel_part.toFixed(2) +" "+ unit);

    // build the return array
    return_array = [[whole_part, con_unit], [decibel_part, unit]];

    logger.info(return_array + '\n');
  } catch (err) {
    logger.info(err);
    return 0;
  }
}
module.exports.converter_whole = converter_whole;

// test code
// converter_whole(11,"tsp.","tbsp.");
