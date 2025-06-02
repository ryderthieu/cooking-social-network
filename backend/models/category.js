const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },    type: {
        type: String,
        required: true,
        enum: ["mealType", "cuisine", "occasions", "dietaryPreferences", "mainIngredients", "cookingMethod", "timeBased", "difficultyLevel"]
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    backgroundColor: {
        type: String,
        default: "#f3f4f6"
    },
    textColor: {
        type: String,
        default: "#374151"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    // Metadata for UI display
    metadata: {
        icon: String,
        gradient: String,
        featured: {
            type: Boolean,
            default: false
        }
    },
    // Parent category for hierarchical structure (if needed)
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    // Stats
    recipeCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better performance
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ type: 1, order: 1 });

// Virtual for full path (useful for nested categories)
categorySchema.virtual('path').get(function() {
    return `/recipes/${this.type}/${this.slug}`;
});

// Method to increment recipe count
categorySchema.methods.incrementRecipeCount = function() {
    this.recipeCount += 1;
    return this.save();
};

// Method to decrement recipe count
categorySchema.methods.decrementRecipeCount = function() {
    if (this.recipeCount > 0) {
        this.recipeCount -= 1;
    }
    return this.save();
};

// Static method to get categories by type
categorySchema.statics.getByType = function(type, options = {}) {
    const query = { type, isActive: true };
    return this.find(query)
        .sort({ order: 1, name: 1 })
        .limit(options.limit || 0);
};

// Static method to get category by slug and type
categorySchema.statics.getBySlugAndType = function(slug, type) {
    return this.findOne({ slug, type, isActive: true });
};

// Static method to get featured categories
categorySchema.statics.getFeatured = function() {
    return this.find({ 
        'metadata.featured': true, 
        isActive: true 
    }).sort({ order: 1 });
};

module.exports = mongoose.model('Category', categorySchema);
