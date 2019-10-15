const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const usernameGenerator = require('username-generator');

const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    const user = new User();
    user.username = await getRandomUsername()
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    let savedUser = await user.save();
    return savedUser.getUsername()
}

async function getRandomUsername() {
    const username = usernameGenerator.generateUsername("-");
    console.log("getRandomUsername: ", username);
    if (await User.findOne({ username: username })) {
        return  getRandomUsername()
    }
    return username
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne().where('username').equals(userParam.username)) {
        throw 'username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    user.username = userParam.username


    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}