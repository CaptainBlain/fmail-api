const db = require('_helpers/db');
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

module.exports = {
    getAll,
    getById,
    getForOwner,
    getVoted,
    create,
    vote,
    unvote,
    update,
    delete: _delete
};

async function getAll(params) {

    console.log(params)

    if (params.type == "latest") {

        let page = params.page

        let limit = 50

        let postsArray = await Post.find()
        .populate('owner','-hash -_id -__v -starred -createdDate')
        .limit(limit)
        .skip(limit*page)
        .sort({createdDate: 'desc'})
        .select('-hash -__v -updatedDate ')

        //let count = await Post.countDocuments({}, function (err, count) { return count });
        //postsArray.push({"pages":Math.ceil(count/limit)})

        let khb = []
        await postsArray.forEach(function(post) {
            khb.push(post.getPost())
            console.log("Return: ", post.comments.size)
            return post.getPost()
        })

        return khb

        /*let postsArary = [];
        let post = await Post.find({}, function (err, posts) {


            posts.forEach(function(post) {
                //console.log(post)

                let subArray = []
                subArray.push(post)
                //owners.push(post.owner)
                post.comments.forEach(function(comment) {

                    Comment.findById(comment.id , function (err, foundComment) {
                        subArray.push(foundComment)
                        console.log("foundComment: ", foundComment)
                    })
                })

                postsArary.push(subArray)
            })
        })


        console.log("Return")
        return postsArary*/

    }
    else if (params.type == "hottest") {
        //Find last 12 hours and most voted

        const now = Date.now()

        const hours = (60 * 60 * 60 * 1000)*12;

        const twelveHoursAgo = new Date().getTime() + hours

        console.log("now: ", new Date(now))
        console.log("twelveHoursAgo: ", new Date(twelveHoursAgo))

        return await Post.find({
            createdAt: {
                $gte: now,
                $lte: twelveHoursAgo
            }}).sort({createdDate: 'desc'}).select('-hash');
    }
}

async function getById(id) {
    return await Post.findById(id).select('-hash -__v');
}

async function getForOwner(params) {

    console.log(params.userId)

    let page = params.page

    let limit = 50

    let postsArray = await Post.find({owner: {$in:params.userId}})
        .populate('owner','-hash -_id -__v -starred -createdDate')
        .limit(limit)
        .skip(limit*page)
        .sort({createdDate: 'desc'})
        .select('-hash -__v -updatedDate ')

    //let count = await Post.countDocuments({}, function (err, count) { return count });
    //postsArray.push({"pages":Math.ceil(count/limit)})

    let khb = []
    await postsArray.forEach(function(post) {
        khb.push(post.getPost())
        console.log("Return: ", post.comments.size)
        return post.getPost()
    })

    return khb

    //return await Post.find({owner: {$in:id}}).select('-hash');
}

async function getVoted(params) {

    if (!params.userId) {
        throw "Owner required";
    }

    const user = await User.findById(params.userId);
    if (!user) {
        throw "User not found";
    }

    let page = params.page
    let limit = 50

    let postsArray = Post.find()
        .where('votes').in(user)
        .populate('owner','-hash -_id -__v -starred -createdDate')
        .limit(limit)
        .skip(limit*page)
        .sort({createdDate: 'desc'})
        .select('-hash -__v -updatedDate ')

    /*let khb = []
    await postsArray.forEach(function(post) {
        khb.push(post.getPost())
        console.log("Return: ", post.comments.size)
        return post.getPost()
    })*/

    return postsArray


}

async function vote(params) {

    console.log(params)

    if (!params.owner) {
        throw "Owner required";
    }
    if (!params.post) {
        throw "Post required";
    }

    const user = await User.findById(params.owner);
    if (!user) {
        throw "User not found";
    }

    const alreadyVotedPost = await Post.findById(params.post).where('votes').in(user);
    if (alreadyVotedPost) {
        throw "Already starred"
    }

    const post = await Post.findById(params.post);
    if (!post) {
        throw "Post not found";
    }
    post.votes.push(user)
    await post.save()

}

async function unvote(params) {

    if (!params.owner) {
        throw "Owner required";
    }
    if (!params.post) {
        throw "Post required";
    }

    const user = await User.findById(params.owner);
    if (!user) {
        throw "User not found";
    }
    const post = await Post.findById(params.post);
    if (!post) {
        throw "Post not found";
    }
    post.votes.pop(user)
    await post.save()

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

    const post = new Post(params);
    post.owner = user

    const savedPost = await post.save()
    // save user
    return savedPost.getPost();
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
    await Post.findOneAndDelete(id);
}