'use strict';

const router = require('express').Router();
const models = require("../models");
const HttpError = require("helpers/HttpError");
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

        models.User
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
                models.User.
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
        models.User.auth(req.form.email,  req.form.password)
                .then(()=>{});
    }
);

module.exports = router;