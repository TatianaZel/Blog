'use strict';

const router = require('express').Router();
const Users = require("../models").User;
const Session = require("../helpers/Session");
const ACL = require('../helpers/ACL');
const HttpError = require("../helpers/HttpError");
const form = require('express-form2');
  var field   = form.field;

router.post(
    ['/signup'],

    // Body validation
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
            .isEmail()
    ),

    // Controller
    (req, res, next) => {

        if(!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        Users
            .findOne({
                where: {
                    email: req.form.email
                }
            })
            .then((user) => {
                if (user) {
                    throw new HttpError(409);
                }
                return null;
            })
            .then(() => {
                Users.
                    create({
                        name: req.form.name,
                        surname: req.form.surname,
                        email: req.form.email,
                        password: req.form.password
                    })
                    .then(() => {
                        res.send();
                    })
                    .catch(next);
            });
    }
);

router.post(
    ['/signin'],

    // Body validation
    form(
        field('email')
            .required()
            .trim()
            .isEmail(),

        field('password')
            .required()
    ),


    // Controller
    (req, res, next) => {
        if (!req.form.isValid) {
            return next(new HttpError(412, "Invalid input data", req.form.errors));
        }

        Users.prototype
            .auth(req.form.email, req.form.password)
            .then((userId) => {
                return Session.create(userId);
            })
            .then((token) => {
                res.send({
                    token
                });
            })
            .catch(next);
    }
);

router.post(
    ['/logout'],

    ACL('auth.logout'),

    // Controller
    (req, res, next) => {
        Session
            .kill(req.session)
            .then(() => {
                res.statusCode = 202;
                res.send();
            })
            .catch(next);
    }
);

module.exports = router;