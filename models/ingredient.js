let mongoose = require('mongoose');

//Ingredient schema
let ingredientSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    measurement:{
        type: String,
        required: true
    },
    servingsize:{
        type: Number,
        required: true
    },
    expiration:{
        type: Number,
        required: true
    }
});

let Ingredient = module.exports = mongoose.model('Ingredient', ingredientSchema);

