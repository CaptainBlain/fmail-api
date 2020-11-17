const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = mongoose.model('Post').schema

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    starred: [PostSchema],
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

schema.methods.getUsername = function () {
    const returnObject = {
        username: this.username
    };
    return returnObject;
};


module.exports = mongoose.model('User', schema);