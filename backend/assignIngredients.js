const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

// Smart mapping based on recipe names to ingredients
const recipeIngredientMapping = {
    // Bánh ngọt và bánh kẹo
    'cupcake': ['Bột mì đa dụng', 'Đường trắng', 'Trứng gà', 'Bơ lạt', 'Sữa tươi', 'Bột nở', 'Vani extract'],
    'brownie': ['Chocolate đen', 'Bơ lạt', 'Đường trắng', 'Trứng gà', 'Bột mì đa dụng', 'Bột cacao'],
    'dorayaki': ['Bột mì đa dụng', 'Trứng gà', 'Đường trắng', 'Mật ong', 'Sữa tươi', 'Baking soda'],
    'mochi': ['Bột gạo', 'Đường trắng', 'Nước', 'Bột matcha'],
    'hotteok': ['Bột mì đa dụng', 'Đường nâu', 'Bơ lạt', 'Sữa tươi', 'Trứng gà'],

    // Món cơm
    'cơm chiên': ['Gạo tẻ', 'Trứng gà', 'Thịt heo ba chỉ', 'Hành tây', 'Tỏi', 'Nước mắm', 'Dầu ăn'],
    'cơm tấm': ['Gạo tẻ', 'Thịt heo ba chỉ', 'Trứng gà', 'Nước mắm', 'Đường trắng', 'Tỏi'],

    // Món bún, phở, mì
    'bún bò': ['Bún tươi', 'Thịt bò thăn', 'Tôm tươi', 'Rau húng quế', 'Ngò', 'Nước mắm', 'Nước lọc'],
    'bún chả': ['Bún tươi', 'Thịt heo ba chỉ', 'Nước mắm', 'Đường trắng', 'Tỏi', 'Rau húng quế', 'Ngò'],
    'phở bò': ['Bánh phở', 'Thịt bò thăn', 'Hành tây', 'Gừng', 'Ngũ vị hương', 'Nước mắm', 'Nước lọc'],
    'mì quảng': ['Mì', 'Thịt heo ba chỉ', 'Tôm tươi', 'Trứng gà', 'Bánh tráng', 'Ngò', 'Nước mắm'],

    // Món nướng và xào
    'gà teriyaki': ['Thịt gà', 'Xì dầu', 'Đường trắng', 'Tỏi', 'Gừng', 'Dầu ăn'],
    'gà xào nấm': ['Thịt gà', 'Nấm hương', 'Hành tây', 'Tỏi', 'Nước mắm', 'Dầu ăn'],
    'gà kho': ['Thịt gà', 'Gừng', 'Nước mắm', 'Đường trắng', 'Nước dừa', 'Tỏi'],
    'bò lúc lắc': ['Thịt bò thăn', 'Khoai tây', 'Hành tây', 'Tỏi', 'Nước mắm', 'Dầu ăn'],

    // Canh
    'canh chua': ['Cá tra', 'Cà chua', 'Dứa', 'Đậu hũ non', 'Rau muống', 'Nước mắm', 'Nước lọc'],
    'canh kim chi': ['Đậu hũ non', 'Thịt heo ba chỉ', 'Hành tây', 'Tỏi', 'Nước mắm'],

    // Cà ri và lẩu
    'cà ri': ['Thịt gà', 'Nước cốt dừa', 'Khoai tây', 'Cà rốt', 'Hành tây', 'Tỏi', 'Gừng'],
    'lẩu thái': ['Tôm tươi', 'Mực', 'Cua', 'Nấm hương', 'Cà chua', 'Nước lọc'],

    // Bánh mì và sandwich
    'bánh mì': ['Bánh mì', 'Thịt heo ba chỉ', 'Cà rốt', 'Ngò', 'Rau thơm', 'Nước mắm'],

    // Pizza và món Ý
    'pizza': ['Bột mì đa dụng', 'Cà chua', 'Phô mai', 'Dầu oliu', 'Tỏi', 'Rau thơm'],

    // Salad
    'salad': ['Rau cải', 'Cà chua', 'Cà rốt', 'Dầu oliu', 'Giấm', 'Muối'],

    // Sushi và món Nhật
    'sushi': ['Gạo tẻ', 'Cá hồi', 'Rong biển', 'Giấm', 'Đường trắng'],

    // Hamburger
    'hamburger': ['Bánh mì', 'Thịt bò thăn', 'Phô mai', 'Cà chua', 'Hành tây'],

    // Pad Thai
    'pad thai': ['Mì', 'Tôm tươi', 'Trứng gà', 'Đậu hũ non', 'Tương ớt', 'Đường trắng'],

    // Taco
    'taco': ['Bánh tráng', 'Thịt bò thăn', 'Cà chua', 'Hành tây', 'Phô mai'],

    // Món ăn vặt
    'bánh tráng': ['Bánh tráng', 'Tôm tươi', 'Thịt heo ba chỉ', 'Rau thơm', 'Tương ớt'],
    'chả giò': ['Bánh tráng', 'Thịt heo ba chỉ', 'Tôm tươi', 'Cà rốt', 'Nấm hương'],
    'gỏi cuốn': ['Bánh tráng', 'Tôm tươi', 'Thịt heo ba chỉ', 'Bún tươi', 'Rau thơm'],

    // Chè và đồ ngọt
    'chè đậu đỏ': ['Đậu đen', 'Nước cốt dừa', 'Đường trắng', 'Nước lọc'],
    'chè thái': ['Nước cốt dừa', 'Đường trắng', 'Đá', 'Dừa nạo'],

    // Xôi
    'xôi': ['Gạo tẻ', 'Nước cốt dừa', 'Muối', 'Đường trắng'],

    // Okonomiyaki
    'okonomiyaki': ['Bột mì đa dụng', 'Rau cải', 'Trứng gà', 'Tương ớt', 'Nước lọc'],

    // Tteokbokki
    'tteokbokki': ['Bột gạo', 'Tương ớt', 'Đường trắng', 'Tỏi'],

    // Bánh xèo
    'bánh xèo': ['Bột năng', 'Nước cốt dừa', 'Tôm tươi', 'Thịt heo ba chỉ', 'Rau cải'],

    // Thịt kho
    'thịt kho': ['Thịt heo ba chỉ', 'Trứng gà', 'Nước mắm', 'Đường trắng', 'Nước dừa'],

    // Cháo
    'cháo': ['Gạo tẻ', 'Thịt gà', 'Gừng', 'Hành lá', 'Nước mắm', 'Nước lọc'],

    // Trứng cuộn
    'trứng cuộn': ['Trứng gà', 'Thịt heo ba chỉ', 'Hành lá', 'Nước mắm', 'Dầu ăn'],

    // Mì vịt tiềm
    'mì vịt': ['Mì', 'Thịt vịt', 'Nấm hương', 'Gừng', 'Rượu trắng'],

    // Default ingredients cho những recipe không match
    'default': ['Thịt heo ba chỉ', 'Hành tây', 'Tỏi', 'Nước mắm', 'Dầu ăn']
};

function findBestIngredients(recipeName) {
    const name = recipeName.toLowerCase();
    
    // Find matching keywords
    for (const [keyword, ingredients] of Object.entries(recipeIngredientMapping)) {
        if (keyword !== 'default' && name.includes(keyword)) {
            return ingredients;
        }
    }
    
    // Return default if no match found
    return recipeIngredientMapping.default;
}

async function assignIngredientsToRecipes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all ingredients from database
        const allIngredients = await Ingredient.find({});
        const ingredientMap = {};
        
        allIngredients.forEach(ing => {
            ingredientMap[ing.name] = ing;
        });

        console.log(`📊 Total ingredients available: ${allIngredients.length}`);

        // Get recipes that have undefined ingredients
        const recipes = await Recipe.find({});
        console.log(`📊 Total recipes to check: ${recipes.length}`);

        let updatedRecipes = 0;
        let recipesWithIssues = 0;

        for (const recipe of recipes) {
            let hasUndefinedIngredients = false;
            let needsUpdate = false;

            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                // Check if recipe has undefined ingredient names
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.name || ingredient.name === 'undefined' || ingredient.name.trim() === '') {
                        hasUndefinedIngredients = true;
                        break;
                    }
                }

                if (hasUndefinedIngredients) {
                    console.log(`\n🔧 Fixing recipe: ${recipe.name || 'Unnamed Recipe'}`);
                    recipesWithIssues++;

                    // Get suggested ingredients for this recipe
                    const suggestedIngredients = findBestIngredients(recipe.name || '');
                    console.log(`   📝 Suggested ingredients: ${suggestedIngredients.join(', ')}`);

                    // Update ingredients
                    const newIngredients = [];
                    let ingredientIndex = 0;

                    for (let i = 0; i < recipe.ingredients.length; i++) {
                        const recipeIngredient = recipe.ingredients[i];
                        
                        // If ingredient has proper name, keep it
                        if (recipeIngredient.name && recipeIngredient.name !== 'undefined' && recipeIngredient.name.trim() !== '') {
                            newIngredients.push(recipeIngredient);
                            continue;
                        }

                        // Get next suggested ingredient
                        if (ingredientIndex < suggestedIngredients.length) {
                            const suggestedName = suggestedIngredients[ingredientIndex];
                            const matchedIngredient = ingredientMap[suggestedName];

                            if (matchedIngredient) {
                                const updatedIngredient = {
                                    ingredient: matchedIngredient._id,
                                    quantity: recipeIngredient.quantity || 100, // Default quantity
                                    name: matchedIngredient.name,
                                    unit: matchedIngredient.unit || 'g'
                                };
                                newIngredients.push(updatedIngredient);
                                console.log(`   ✅ Assigned: ${matchedIngredient.name} (${matchedIngredient.unit})`);
                                needsUpdate = true;
                            } else {
                                // Keep original if no match found
                                newIngredients.push(recipeIngredient);
                                console.log(`   ❌ No match found for: ${suggestedName}`);
                            }
                        } else {
                            // Use default ingredient if we run out of suggestions
                            const defaultIngredient = ingredientMap['Thịt heo ba chỉ'];
                            if (defaultIngredient) {
                                const updatedIngredient = {
                                    ingredient: defaultIngredient._id,
                                    quantity: recipeIngredient.quantity || 100,
                                    name: defaultIngredient.name,
                                    unit: defaultIngredient.unit
                                };
                                newIngredients.push(updatedIngredient);
                                needsUpdate = true;
                            } else {
                                newIngredients.push(recipeIngredient);
                            }
                        }

                        ingredientIndex++;
                    }

                    // Update recipe if changes were made
                    if (needsUpdate) {
                        await Recipe.findByIdAndUpdate(recipe._id, {
                            ingredients: newIngredients
                        });
                        updatedRecipes++;
                        console.log(`   ✅ Updated recipe: ${recipe.name}`);
                    }
                }
            }
        }

        console.log('\n📈 Summary:');
        console.log(`   Total recipes: ${recipes.length}`);
        console.log(`   Recipes with issues: ${recipesWithIssues}`);
        console.log(`   Recipes updated: ${updatedRecipes}`);

        // Verify the results
        console.log('\n🔍 Verification:');
        const verifyRecipes = await Recipe.find({}).populate('ingredients.ingredient');
        let stillInvalid = 0;

        for (const recipe of verifyRecipes) {
            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.name || ingredient.name === 'undefined' || !ingredient.ingredient) {
                        stillInvalid++;
                        console.log(`❌ Still invalid: ${recipe.name} - ingredient: ${ingredient.name}`);
                        break;
                    }
                }
            }
        }

        if (stillInvalid === 0) {
            console.log('🎉 All recipes now have valid ingredients!');
        } else {
            console.log(`⚠️  ${stillInvalid} recipes still have issues`);
        }

        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

assignIngredientsToRecipes();
