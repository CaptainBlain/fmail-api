const db = require('_helpers/db');
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

module.exports = {
    getAll,
    getForPost,
    getById,
    getForOwner,
    getForComment,
    create,
    update,
    delete: _delete
};

async function getForPost(id) {

    const post = await Post.findById(id).select('-hash')

    if (!post)
        throw "Post not found"

    return await Comment.find({post: post._id}).select('-hash -__v').populate('owner', 'username');

}

async function getForComment(id) {

    const comment = await Comment.findById(id).select('-hash').populate({ path: 'comments', populate: { path:'owner', model:'User', select: 'username'}, model: Comment });

    if (!comment)
        throw "Comment not found"

    return comment

}

async function getAll() {
    return await Comment.find().select('-hash');
}


async function getById(id) {
    return await Comment.findById(id).select('-hash -__v').populate('owner', 'username');;
}

async function getForOwner(params) {

    console.log(params.id)

    return await Post.find({owner: {$in:params.id}}).select('-hash');
}


async function create(params) {
    // validate

    console.log(params)

    if (!params.owner) {
        throw "Owner required";
    }
    if (!params.subject) {
        throw "Subject required";
    }
    if (!params.content) {
        throw "Content required";
    }

    const user = await User.findById(params.owner);

    const comment = new Comment(params);
    comment.owner = user

    //Deal with post if it's a post
    let post;
    if (params.post) {
        post = await Post.findById(params.post);
        console.log("post", post)
        if (!post) {
            throw "Post not found";
        }
        comment.level = 0
        comment.post = post
        let user = await User.findById(post.owner).select('username')
        comment.to = user.username
    }

    //Save the comment
    const savedComment = await comment.save()

    //Push the comment on to the post
    if (params.post) {
        post.comments.push(savedComment)
        await post.save()
    }

    //Push the comment on to the comment
    if (params.comment) {
        const parentComment = await Comment.findById(params.comment);
        if (!parentComment) {
            throw "Comment not found";
        }
        let user = await User.findById(parentComment.owner).select('username')
        comment.level = parentComment.level + 1
        comment.to = user.username
        parentComment.comments.push(comment.id)
        await parentComment.save()
    }

    // save user
    return savedComment.getNewComment();
}


async function update(id, eventParam) {
    const event = await Event.findById(id);

    // validate
    if (!event) throw 'Event not found';

    //If we have categories
    if (eventParam.type) {
        event.categories = []
        eventParam.type.forEach(function (cat) {
            event.categories.push({type: cat})
        })
    }
    // copy userParam properties to user
    Object.assign(event, eventParam);

    await event.save();
}

async function _delete(id) {
    await Comment.findOneAndDelete(id);
}