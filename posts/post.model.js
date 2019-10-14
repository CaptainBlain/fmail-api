const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = mongoose.model('Comment').schema

const schema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: false },
    content: { type: String, required: false },
    //category:  CategorySchema ,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],

    votes: [{ type: String }],
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});


schema.methods.getPost = function () {
    const returnObject = {
        postId: this._id,
        subject: this.subject,
        content: this.content,
        category: this.category,
        comments: this.comments,
        votes: this.votes,
        createdDate: this.createdDate,
        ownerUsername: this.owner.username
    };
    return returnObject;
};

schema.methods.getPostComments = function () {
    const returnObject = {
        postId: this._id,
        ownerUsername: this.owner.username,
        subject: this.subject,
        content: this.content,
        category: this.category,
        comments: this.comments,
        votes: this.votes,
        createdDate: this.createdDate,
        ownerId: this.owner._id
    };
    return returnObject;
};

schema.methods.getOwner = function () {
    const returnObject = {
        owner: this.owner,
    };
    return returnObject;
};

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', schema);