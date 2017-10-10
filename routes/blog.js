"use strict";

const router = require("express").Router();
const Posts = require("../models").Post;
const Session = require("../helpers/Session");
const HttpError = require("../helpers/HttpError");

router.get(
    ['/:userId'],

    // Controller
    (req, res, next) => {

        Posts
            .findAll({
                where: {
                    UserId: req.param('userId')
                }
            })
            .then((allPosts) => {
                res.send(allPosts);
            })
            .catch(next);
    }
);

// Params
router.param('userId', (req, res, next, userId) => {
    if((userId ^ 0) != userId) {
        return next(new HttpError(416, "Post id is not valid"));
    }

    next();
});

module.exports = router;
