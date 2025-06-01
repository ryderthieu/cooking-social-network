const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    thumbnail: {
        type: String, // URL to collection thumbnail image
        default: null
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false // For system default collections like "Yêu thích", "Đã xem"
    },
    defaultType: {
        type: String,
        enum: ['favorites', 'viewed', 'created'],
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
collectionSchema.index({ owner: 1, name: 1 });
collectionSchema.index({ owner: 1, isDefault: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
