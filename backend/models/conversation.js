const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    members: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    name: {type: String, default: ''}
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Conversation', conversationSchema)