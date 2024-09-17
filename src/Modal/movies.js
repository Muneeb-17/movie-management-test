const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: { 
        type: String, 
        required: true 
    },
    publishingYear: { 
        type: Number, 
        required: true
    },
    poster: { 
        type: String 
    }
});

module.exports = mongoose.model('Movie', MovieSchema);