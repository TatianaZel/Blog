"use strict";

const router = require("express").Router();
const Posts = require("../models").Post;
const Session = require("../helpers/Session");
const ACL = require("../helpers/ACL");
const HttpError = require("../helpers/HttpError");
const form = require("express-form2");
  var field = form.field;

/**
 * Create post
 */
router.post(
    ['/'],

    ACL(),

    form(
        field('title')
            .trim()
            .required()
            .minLength(3)
            .maxLength(255),

        field('text')
            .trim()
            .required()
    ),

    // Controller
    (req, res, next) => {

        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        let post = new Posts({
            title: req.form.title,
            text: req.form.text,
            UserId: req.userId
        });

        post
            .save()
            .then(() => {
                res.send(post);
            })
            .catch(next);
    }
);

/**
 * Delete post by Id
 */
router.delete(
    ['/:postId'],

    ACL(),

    // Controller
    (req, res, next) => {
        let post = req.data.post;

        if (post.UserId !== req.userId)
            next(new HttpError(403, "Unavailable action"));

        post
            .destroy()
            .then(() => {
                res.send(post);
            })
            .catch(next);

    }
);

/**
 * Update post by Id
 */
router.put(
    ['/:postId'],

    ACL(),

    form(
        field('title')
            .trim()
            .required()
            .minLength(3)
            .maxLength(255),

        field('text')
            .trim()
            .required()
    ),

    // Controller
    (req, res, next) => {
        let post = req.data.post;

        if (post.UserId !== req.userId)
            next(new HttpError(403, "Unavailable action"));

        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        post.title = req.form.title;
        post.text = req.form.text;

        post
            .save()
            .then(() => {
                res.send(post);
            })
            .catch(next);
    }
);

/**
 * Get one post by Id
 */
router.get(
    ['/:postId'],

    // Controller
    (req, res, next) => {
        res.send(req.data.post);
    }
);

// Params
router.param('postId', (req, res, next, postId) => {
    if((postId ^ 0) != postId) {
        return next(new HttpError(416, "Post id is not valid"));
    }

    Posts
        .findById(postId)
        .then((post) => {
            if (!post) {
                return next(new HttpError(404, "Post not found"));
            }

            req.data = req.data || {};
            req.data.post = post;
            next();
        })
        .catch(next);
});

module.exports = router;
