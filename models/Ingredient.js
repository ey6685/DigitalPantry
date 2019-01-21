let Sequelize = require('sequelize');

const Ingredient = db.define('ingredient', {
    name: {
        type: Sequelize.CHAR
    },
    measurement: {
        type: Sequelize.CHAR
    },
    servingsize: {
        type: Sequelize.INTEGER
    },
    expiration: {
        type: Sequelize.INTEGER
    }
})

module.exports = Ingredient;