/*
this fill hows the intput cleaner for the app'
it is in a file so i can call it on any page i need
*/

//cleans string inputs
//takes a string
//outputs a new str that is only alphanumaric
const val = require('validator')

async function string_cleaning(str){
  //check to see if the string has any bad chars in it
  if(val.isAlphanumeric(str))
  {
    console.log("string is already clean")
    clean_str = str
  }
  else{
    //clean the string
    //only letters numbers and dashes
    var clean_str = await val.whitelist(str,'\\w\-\\s')
  }
  console.log("str cleaning: " + str + " -> " +clean_str)
  return clean_str
}

//test code
//string_cleaning("i'm a*b@d b0!")
//string_cleaning("this string is good")
module.exports.string_cleaning = string_cleaning

//^^
//send out a string that doesnt have (,),:,;
async function password_cleaning(str){
  //if letters of number just return the string
  if(val.isAlphanumeric(str))
  {
    console.log("string is already clean")
    clean_str = str
  }
  else{
  //else remove the the char below
  var clean_str = await val.blacklist(str,';()*')
  console.log("str cleaning: " + str + " -> " +clean_str)
  }
  return clean_str
}
module.exports.password_cleaning = password_cleaning;


//cleans input but allows for the @ and .
async function email_cleaning(str){


    var clean_str = await val.whitelist(str,'\\w\-\\s@.')
  
  console.log("str cleaning: " + str + " -> " +clean_str)
  return clean_str
}
module.exports.email_cleaning = email_cleaning
//email_cleaning("pat*#@Yah()().com")


//same as above
//retunrs a float that has be trimmed of all the non numbers 
async function num(num_str)
{
  //if it is a num return the num
  if(val.isDecimal(num_str))
  {
    return parseFloat(num_str)
  }
  else{
    //take out anything that is not a number and return it as a float
    var clean = await val.whitelist(num_str, "0123456789.")
    console.log("str cleaning: " + num_str + " -> " +clean)
    return parseFloat(clean);

  }
}
module.exports.num = num
// num ("3!@.aw1*&)4")
