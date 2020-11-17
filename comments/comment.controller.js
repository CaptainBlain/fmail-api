const express = require('express');
const router = express.Router();
const commentsService = require('./comment.service');

// routes
router.post('/create', create);

router.get('/getForOwner', getForOwner);
router.get('/:id', getById);
router.get('/getForPost/:id', getForPost);
router.get('/getForComment/:id', getForComment);
router.get('/getAll', getAll);

router.post('/apply', apply);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    commentsService.create(req.body)
        .then((business) => res.json(business))
        .catch(err => next(err));
}

function onComment(req, res, next) {
    commentsService.create(req.body)
        .then((business) => res.json(business))
        .catch(err => next(err));
}

//Gets
function getForPost(req, res, next) {
    commentsService.getForPost(req.params.id)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}
function getForComment(req, res, next) {
    commentsService.getForComment(req.params.id)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    commentsService.getAll()
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

function getForOwner(req, res, next) {
    commentsService.getForOwner(req.query)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    commentsService.getById(req.params.id)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

//Event Applying
function apply(req, res, next) {
    commentsService.apply(req.body)
        .then(() => res.json("Successfully applied for event"))
        .catch(err => next(err));
}


function update(req, res, next) {
    commentsService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    commentsService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}