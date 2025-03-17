const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: {type: String, required : true},
    unit: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model('Ingredient', ingredientSchema)