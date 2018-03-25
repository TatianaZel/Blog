const router = require('express').Router();

const Users = require('../models').User;
const Session = require('../helpers/Session');
const ACL = require('../helpers/ACL');
const HttpError = require('../helpers/HttpError');
const form = require('express-form2');

const field = form.field;

router.post(
    ['/signup'],

    form(
        field('password')
        .required()
        .minLength(8)
        .maxLength(40),
        field('name')
        .required(),
        field('surname')
        .required(),
        field('email')
        .required()
        .trim()
        .isEmail(),
        field('description')
        .trim()
    ),

    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, 'Invalid input data', req.form.errors));
        }

        Users
            .checkEmail(req.form.email, 0)
            .then(() => {
                Users.create({
                    name: req.form.name,
                    surname: req.form.surname,
                    email: req.form.email,
                    password: req.form.password,
                    description: req.form.description,
                })
                    .then(() => {
                        res.send();
                    })
                    .catch(next);
            })
            .catch(next);
    }
);

router.post(
    ['/signin'],

    form(
        field('email')
        .required()
        .trim()
        .isEmail(),
        field('password')
        .required()
    ),

    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, 'Invalid input data', req.form.errors));
        }

        let user;

        Users
            .auth(req.form.email, req.form.password)
            .then((usr) => {
                user = usr;
                return Session.create(usr.id);
            })
            .then((token) => {
                res.send({
                    token,
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email
                });
            })
            .catch(next);
    }
);

router.post(
    ['/logout'],

    ACL(),

    (req, res, next) => {
        Session
            .kill(req.session)
            .then(() => {
                res.send({});
            })
            .catch(next);
    }
);

module.exports = router;
