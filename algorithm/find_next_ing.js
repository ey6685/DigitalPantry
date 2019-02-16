//this file is to find the next expiring ingredient
//this is utilized on the user dashboard

//inputs
//--system date

//requires
const ingredient_t = require('../DB_models/Ingredients');
const op = require('sequelize').Op;

async function next_exp_ingredient()
{   //seting up date
    try{
        var date = new Date();
        var month = date.getMonth();
        var day = date.getDate();
        var year = date.getFullYear();
        var local_date = year + '-' + month + '-' + day;
        // console.log(local_date);
    }
    catch(err)
    {
        console.log("something went wrong with date time geting\n" + err);
    }

    try
    {
        //query the db for all not exipred ingredients
        var ingredient_results = await ingredient_t.findAll({
            where: {
                ingredient_expiration_date: {
                    [op.gte]: local_date
                },
                ingredient_expiration_date: {
                    [op.ne]: null
                }
            }
        })
        var next = ingredient_results[0]
        for(var i=1; i<ingredient_results.length;i++)
        {
            if(next.ingredient_expiration_date >= ingredient_results[i].ingredient_expiration_date)
            {
                next = ingredient_results[i];
            }   
        }
        // console.log(JSON.stringify(next));
        return next;
    }
    catch(err)
    {
        console.log(err);
    }

    
}

module.exports.next_exp_ingredient = next_exp_ingredient;

// //testting code
// next_exp_ingredient();