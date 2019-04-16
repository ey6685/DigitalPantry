/*
this fill hows the intput cleaner for the app'
it is in a file so i can call it on any page i need
*/

//cleans string inputs
//takes a string
//outputs a new str that is only alphanumaric
const val = require('validator')

async function string_cleaning(str){

  if(val.isAlphanumeric(str))
  {
    console.log("string is already clean")
    clean_str = str
  }
    var clean_str = await val.whitelist(str,'\\w\-\\s')
  
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

  var clean_str = await val.blacklist(str,';()*')
  
  console.log("str cleaning: " + str + " -> " +clean_str)
  return clean_str
}
module.exports.password_cleaning = password_cleaning;

//password_cleaning("darkmage9(;*)")

async function email_cleaning(str){


    var clean_str = await val.whitelist(str,'\\w\-\\s@.')
  
  console.log("str cleaning: " + str + " -> " +clean_str)
  return clean_str
}
module.exports.email_cleaning = email_cleaning
//email_cleaning("pat*#@Yah()().com")