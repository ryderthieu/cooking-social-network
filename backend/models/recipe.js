const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    ingredients: [
        {
            ingredient: {type: Schema.Types.ObjectId, ref: 'Ingredient'},
            quantity: {type: Number}
        }
    ],
    steps: [
        {
            step: {type: String, required: true}
        }
    ],
    image: [
        {
            uri: {type: String}
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema)