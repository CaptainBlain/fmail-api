const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    imageUrl: { type: String, required: false },
    type: { type: String, enum: ['All', 'Latest', 'Hottest']},
});

schema.methods.getType = function () {
    const returnObject = {
        type: this.type,
    };
    return returnObject;
};

//schema.set('toJSON', { virtuals: true });

schema.set('toObject', {
    transform: function (doc, ret) {
        //ret.id = ret._id
        delete ret.hash
        delete ret._id
        delete ret.id
        //delete ret.__v
        //delete ret.createdDate
    }
})

module.exports = mongoose.model('Category', schema);