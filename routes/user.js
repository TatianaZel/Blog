const router = require('express').Router();
const Users = require('../models').User;
const Session = require('../helpers/Session');
const ACL = require('../helpers/ACL');
const HttpError = require('../helpers/HttpError');
const form = require('express-form2');

const field = form.field;

/**
 * Get all users
 */
router.get(
    ['/'],

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

    (req, res, next) => {
        res.send(req.data.user);
    }
);

/**
 * Update user by Id
 */
router.put(
    ['/edit-profile/:userId'],

    ACL(),

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

    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, 'Invalid input data', req.form.errors));
        }

        const user = req.data.user;

        if (user.id !== req.userId) {
            next(new HttpError(403, 'Access denied!'));
        }

        Users
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
                    .catch(next);
            })
            .catch(next);
    }
);

/**
 * Update user by Id
 */
router.put(
    ['/edit-password'],

    ACL(),

    form(
        field('currentPassword')
        .required(),
        field('newPassword')
        .required()
        .minLength(8)
        .maxLength(40)
    ),

    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, 'Invalid input data', req.form.errors));
        }

        Users.findById(req.userId)
            .then((user) => {
                if (user.password !== req.form.currentPassword) {
                    return next(new HttpError(403, 'Uncorrect password'));
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
    if ((userId ^ 0) != userId) {
        return next(new HttpError(416, 'Invalid user id'));
    }

    Users.find({
            where: {id: userId},
            attributes: {exclude: ['password']}
        })
        .then((user) => {
            if (!user) {
                return next(new HttpError(404, 'User not exist'));
            }

            req.data = req.data || {};
            req.data.user = user;
            next();
        })
        .catch(next);
});

module.exports = router;
