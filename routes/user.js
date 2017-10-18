"use strict";

const router = require("express").Router();
const Users = require("../models").User;
const Session = require("../helpers/Session");
const ACL = require("../helpers/ACL");
const HttpError = require("../helpers/HttpError");
const form = require("express-form2");
  var field = form.field;

/**
 * Get all users
 */
router.get(
    ['/'],

    // Controller
    (req, res, next) => {

        Users
            .findAll({
                attributes: {exclude: ['password']}
            })
            .then((allUsers) => {
                res.send(allUsers);
            })
            .catch(next);
    }
);

/**
 * Get one user by Id
 */
router.get(
    ['/:userId'],

    // Controller
    (req, res, next) => {
        res.send(req.data.user);
    }
);

/**
 * Update user by Id
 */
router.put(
    ['/:userId'],

    ACL(),

// Body validation
    form(
        field('name')
            .required(),

        field('surname')
            .required(),

        field('email')
            .required()
            .trim()
            .isEmail(),

        field('description')
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid)
            return next(new HttpError(412, "Invalid input data", req.form.errors));

        let user = req.data.user;

        if (user.id !== req.userId)
            next(new HttpError(403, "Unavailable action"));

        Users.prototype
            .checkEmail(req.form.email, user.id)
            .then(() => {
                user.name = req.form.name;
                user.surname = req.form.surname;
                user.email = req.form.email;
                user.description = req.form.description;

                user
                    .save()
                    .then(() => {
                        res.send(user);
                    })
                    .catch(next);//?
            })
            .catch(next);
    }
);

/**
 * Update user by Id
 */
router.put(
    ['/changePassword/:userId'],

    ACL(),

    form(
        field('currentPassword')
            .required(),

        field('newPassword')
            .required()
            .minLength(8)
            .maxLength(40)
    ),

    // Controller
    (req, res, next) => {
        if (!req.form.isValid)
            return next(new HttpError(412, "Invalid input data", req.form.errors));

        let user = req.data.user;

        if (user.id !== req.userId)
            next(new HttpError(403, "Unavailable action"));

        Users.findById(user.id)
            .then((user) => {
                if (user.password !== req.form.currentPassword) {
                    return next(new HttpError(403, "Uncorrect password"));
                }

                user.password = req.form.newPassword;

                user
                    .save()
                    .then(() => {
                        res.send({});
                    })
                    .catch(next);
            })
            .catch(next);
    }
);

// Params
router.param('userId', (req, res, next, userId) => {
        if((userId ^ 0) != userId)
            return next(new HttpError(416, "Post id is not valid"));

        Users.find({
                where: {id: userId},
                attributes: {exclude: ['password']}
            })
            .then((user) => {
                if (!user) {
                    return next(new HttpError(404, "User not found"));
                }

                req.data = req.data || {};
                req.data.user = user;
                next();
            })
            .catch(next);
    }
);

module.exports = router;
