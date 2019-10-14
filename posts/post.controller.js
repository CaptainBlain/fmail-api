const express = require('express');
const router = express.Router();
const postService = require('./post.service');

// routes
router.post('/create', create);

router.get('/getForOwner', getForOwner);
router.get('/getVoted', getVoted);

router.get('/getAll', getAll);

router.post('/vote', vote);
router.post('/unvote', unvote);

router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    postService.create(req.body)
        .then((business) => res.json(business))
        .catch(err => next(err));
}


function getAll(req, res, next) {

    postService.getAll(req.query)
        .then(posts => posts ? res.json(posts) : res.sendStatus(404))
        .catch(err => next(err));
}

function getForOwner(req, res, next) {
    postService.getForOwner(req.query)
        .then(business => business ? res.json(business) : res.sendStatus(404))
        .catch(err => next(err));
}

function getVoted(req, res, next) {
    postService.getVoted(req.query)
        .then(business => business ? res.json(business) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    postService.getById(req.params.id)
        .then(business => business ? res.json(business) : res.sendStatus(404))
        .catch(err => next(err));
}


function vote(req, res, next) {
    postService.vote(req.body)
        .then(() => res.json("Successfully voted"))
        .catch(err => next(err));
}
function unvote(req, res, next) {
    postService.unvote(req.body)
        .then(() => res.json("Successfully unvoted"))
        .catch(err => next(err));
}


function update(req, res, next) {
    postService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    postService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}