const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: String },
    post: { type: Schema.Types.ObjectId, ref: 'Post'},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    subject: { type: String, required: false },
    content: { type: String, required: false },
    votes: { type: Number },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

schema.methods.getNewComment = function () {
    const returnObject = {
        commentId: this.commentId
    };
    return returnObject;
};

schema.methods.getComment = function () {
    const returnObject = {
        commentId: this.commentId,
        post: this.post,
        to: this.to,
        comments: this.comments,
        subject: this.subject,
        content: this.content,
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

schema.set('toObject', {
    transform: function (doc, ret) {
        //ret.id = ret._id
        delete ret.hash
        delete ret._id
        delete ret.id
        delete ret.post
        delete ret.__v
        //delete ret.createdDate
    }
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comment', schema);