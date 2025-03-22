const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: { type: String, required: true, unique: true },
    unit: { type: String },  
    nutrition: {
        calories: { type: Number, default: 0 },  // Lượng calo (kcal)
        protein: { type: Number, default: 0 },   // Chất đạm (g)
        fat: { type: Number, default: 0 },       // Chất béo (g)
        carbs: { type: Number, default: 0 }      // Carbohydrate (g)
    },
    image: {type: String},
    author: {type: Schema.ObjectId, ref: 'User'}
}, {
    timestamps: true
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
