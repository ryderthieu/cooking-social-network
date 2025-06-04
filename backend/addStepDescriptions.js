const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');

// Function to generate description based on step content
function generateStepDescription(stepText, stepIndex, recipeName) {
    if (!stepText) return '';
    
    const step = stepText.toLowerCase();
    const stepNumber = stepIndex + 1;
    
    // Common cooking action patterns and their descriptions
    const actionDescriptions = {
        // Preparation steps
        'sơ chế': `Chuẩn bị và sơ chế nguyên liệu cần thiết cho món ${recipeName}. Đảm bảo tất cả nguyên liệu được rửa sạch và cắt thành kích cỡ phù hợp.`,
        'chuẩn bị': `Chuẩn bị tất cả nguyên liệu cần thiết. Đo lường chính xác và sắp xếp gọn gàng để quá trình nấu nướng diễn ra thuận lợi.`,
        'rửa': `Rửa sạch nguyên liệu dưới nước chảy để loại bỏ bụi bẩn và tạp chất. Để ráo nước trước khi chế biến.`,
        'cắt': `Cắt nguyên liệu theo kích thước phù hợp. Đảm bảo dao sắc và cắt đều để món ăn có hình thức đẹp mắt.`,
        
        // Mixing and preparation
        'trộn': `Trộn đều các nguyên liệu với nhau. Sử dụng tay hoặc dụng cụ trộn để đảm bảo tất cả thành phần được kết hợp hài hòa.`,
        'đánh': `Đánh đều hỗn hợp để tạo độ xốp và mịn. Có thể sử dụng máy đánh trứng hoặc đánh tay tùy theo yêu cầu của công thức.`,
        'pha': `Pha loãng và trộn đều các nguyên liệu lỏng. Khuấy từ từ để tránh tạo bọt khí không mong muốn.`,
        'hòa': `Hòa tan hoàn toàn các nguyên liệu khô vào chất lỏng. Khuấy đều cho đến khi không còn cục bột.`,
        
        // Cooking methods
        'chiên': `Chiên trong dầu nóng với lửa vừa. Lật đều để món ăn chín đều và có màu vàng đẹp mắt.`,
        'xào': `Xào nhanh trên lửa lớn để giữ nguyên độ giòn của nguyên liệu. Khuấy đều để tránh bị cháy.`,
        'nướng': `Nướng trong lò ở nhiệt độ thích hợp. Theo dõi thường xuyên để đảm bảo món ăn chín đều và không bị khô.`,
        'luộc': `Luộc trong nước sôi cho đến khi nguyên liệu chín mềm. Thời gian luộc tùy thuộc vào loại thực phẩm.`,
        'hầm': `Hầm với lửa nhỏ trong thời gian dài để nguyên liệu mềm và thấm vị. Đậy nắp để giữ hơi nước.`,
        'rang': `Rang trên chảo khô hoặc với ít dầu để tạo mùi thơm. Khuấy đều để tránh bị cháy.`,
        'nấu': `Nấu với nhiệt độ phù hợp cho đến khi nguyên liệu chín. Điều chỉnh lửa theo yêu cầu của món ăn.`,
        
        // Specific techniques
        'đun': `Đun nóng với lửa vừa phải. Khuấy đều để tránh bị dính đáy và đảm bảo nhiệt độ đồng đều.`,
        'đổ': `Đổ hỗn hợp một cách nhẹ nhàng và đều. Kiểm soát tốc độ đổ để đạt kết quả mong muốn.`,
        'thêm': `Thêm nguyên liệu theo đúng thứ tự và tỷ lệ. Trộn đều sau mỗi lần thêm để đảm bảo hòa quyện.`,
        'nêm': `Nêm nếm gia vị theo khẩu vị. Thêm từ từ và nếm thử để đạt được hương vị cân bằng.`,
        'để': `Để nghỉ hoặc ủ trong thời gian quy định. Điều này giúp nguyên liệu thấm vị và đạt độ chín hoàn hảo.`,
        
        // Final steps
        'bày': `Bày trí món ăn ra đĩa một cách hấp dẫn. Chú ý đến màu sắc và cách sắp xếp để tăng tính thẩm mỹ.`,
        'trang trí': `Trang trí món ăn với các nguyên liệu phù hợp. Tạo điểm nhấn để món ăn trở nên bắt mắt hơn.`,
        'phục vụ': `Phục vụ món ăn khi còn nóng. Chuẩn bị đầy đủ gia vị và rau sống kèm theo nếu cần.`,
    };
    
    // Find matching action in step text
    for (const [action, description] of Object.entries(actionDescriptions)) {
        if (step.includes(action)) {
            return description;
        }
    }
    
    // Step-specific descriptions based on position
    if (stepNumber === 1) {
        return `Bước đầu tiên trong quá trình chế biến ${recipeName}. Thực hiện cẩn thận để tạo nền tảng tốt cho những bước tiếp theo.`;
    } else if (stepIndex === 'last') {
        return `Bước hoàn thiện cuối cùng của món ${recipeName}. Kiểm tra kỹ hương vị và nhiệt độ trước khi phục vụ.`;
    }
    
    // Generic descriptions based on content
    if (step.includes('gia vị') || step.includes('nêm')) {
        return 'Nêm nếm gia vị theo khẩu vị. Điều chỉnh độ mặn, ngọt, chua, cay cho phù hợp với sở thích gia đình.';
    }
    
    if (step.includes('lửa') || step.includes('nhiệt độ')) {
        return 'Điều chỉnh nhiệt độ phù hợp để đảm bảo món ăn chín đều. Theo dõi quá trình nấu để tránh bị cháy hoặc chưa chín.';
    }
    
    if (step.includes('khuôn')) {
        return 'Chuẩn bị khuôn nướng sạch sẽ và thoa bơ để tránh dính. Đổ hỗn hợp vào khuôn một cách đều đặn.';
    }
    
    // Default description
    return `Thực hiện bước ${stepNumber} một cách cẩn thận theo hướng dẫn. Đảm bảo tuân thủ đúng quy trình để đạt kết quả tốt nhất.`;
}

async function addStepDescriptions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all recipes
        const recipes = await Recipe.find({});
        console.log(`📊 Processing ${recipes.length} recipes...`);

        let updatedRecipes = 0;
        let totalStepsUpdated = 0;

        for (const recipe of recipes) {
            if (!recipe.steps || recipe.steps.length === 0) {
                continue;
            }

            let hasUpdates = false;
            const updatedSteps = recipe.steps.map((step, index) => {
                // Check if description is missing or empty
                if (!step.description || step.description.trim() === '') {
                    hasUpdates = true;
                    totalStepsUpdated++;
                    
                    const isLastStep = index === recipe.steps.length - 1;
                    const stepIndex = isLastStep ? 'last' : index;
                    
                    return {
                        ...step.toObject(),
                        description: generateStepDescription(step.step, stepIndex, recipe.name)
                    };
                }
                return step;
            });

            if (hasUpdates) {
                await Recipe.findByIdAndUpdate(recipe._id, {
                    steps: updatedSteps
                });
                updatedRecipes++;
                console.log(`✅ Updated ${recipe.name} - ${updatedSteps.filter(s => s.description).length} steps`);
            }
        }

        console.log('\n📈 Summary:');
        console.log(`Total recipes processed: ${recipes.length}`);
        console.log(`Recipes updated: ${updatedRecipes}`);
        console.log(`Total steps updated: ${totalStepsUpdated}`);

        // Verification
        const verifyRecipes = await Recipe.find({});
        let recipesWithMissingDescriptions = 0;
        let stepsWithMissingDescriptions = 0;

        for (const recipe of verifyRecipes) {
            if (recipe.steps && recipe.steps.length > 0) {
                let recipeMissingDesc = false;
                for (const step of recipe.steps) {
                    if (!step.description || step.description.trim() === '') {
                        stepsWithMissingDescriptions++;
                        recipeMissingDesc = true;
                    }
                }
                if (recipeMissingDesc) {
                    recipesWithMissingDescriptions++;
                }
            }
        }

        console.log('\n🔍 Verification:');
        console.log(`Recipes still missing descriptions: ${recipesWithMissingDescriptions}`);
        console.log(`Steps still missing descriptions: ${stepsWithMissingDescriptions}`);

        if (stepsWithMissingDescriptions === 0) {
            console.log('🎉 All recipe steps now have descriptions!');
        }

        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

addStepDescriptions();
