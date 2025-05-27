const mongoose = require("mongoose");
const slugify = require("slugify");
const Ingredient = require("./backend/models/ingredient.js");

// 🔧 Kết nối đến MongoDB
mongoose.connect("mongodb+srv://thieu:admin@ryderthieu.uwzdb.mongodb.net/cooking-social-network?retryWrites=true&w=majority&appName=ryderthieu", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    return updateSlugs();
})
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🧠 Hàm cập nhật slug cho từng document
const updateSlugs = async () => {
    try {
        const ingredients = await Ingredient.find();

        for (const ingredient of ingredients) {
            const slug = slugify(ingredient.name, { lower: true, locale: 'vi' });
            ingredient.slug = slug;
            await ingredient.save();
            console.log(`✅ Updated slug for: ${ingredient.name} → ${slug}`);
        }

        console.log("🎉 Tất cả slug đã được cập nhật.");
        process.exit(0); // thoát script
    } catch (err) {
        console.error("❌ Error updating slugs:", err);
        process.exit(1); // thoát với lỗi
    }
};
