/**
 * Helper for session checking and variables definition
 *
 * helper contain current session of user in `req.session` var, if session
 * does exists.
 *
 * @module helpers/Session
 */
'use strict';

const Users = require("../models").User;

const HttpError = require("../helpers/HttpError");

var Session = {
    /**
     * Express middleware to detect and activate session.
     * Define session provider.
     *
     * if sesson not defined, expires, ect
     */
    middleware(req, res, next) {
        Session
            .check(req)
            .then(
                (user) => {
                    console.log(user);

                    req.userId = user._id;
                    req.user = user;
                    req.session = req.headers.token;

                    next();
                }
            )
            .catch((err) => {
                next();
            });
    },
    /**
     * Check session by token header in `req.headers.token`
     *
     * @param req {Object} express middleware request param
     * @returns {Promise: ~resolve => session Object}
     */
    check(req) {
        return new Promise((resolve, reject) => {
            let token = req.headers.token || null;
            if (token) {
                return Session.get(token).then(resolve, reject);
            }
            reject(null);
        });
    },
    /**
     * Creates the session for user
     *
     * @param userId {ObjectId} users id
     * @param ip {String} users ip
     * @param data {Object} object to store
     * @returns {Promise ~resolve => session Object}
     */
    create(userId) {
        return Users
            .findById(userId)
            .then((user) => {
                return user.setSession();///////////////
            });
    },
    /**
     * Returns all sessions of user
     *
     * @param token {TokenId} token
     * @returns {Promise ~resolve => session Object}
     */
    get(token) {
        return  Users.findOne({
                    where: {
                        session: token
                    }
                })
                .then((user) => {
                    if (user) {
                        return user;
                    }
                    throw "user not found";
                });
    },
    /**
     * Kill the session
     *
     * @param token {TokenId} token
     * @returns {Promise ~resolve => session Object}
     */
    kill(token) {
        return Users
            .findOne({
                where: {
                    session: token
                }
            })
            .then((user) => {
                return user.removeSession(token);////////////////////
            });
    },
    /**
     * Kill all sessions of user
     *
     * @param userId {ObjectId} users id
     * @returns {Promise ~resolve => session Object}
     */
    killall(userId) {
        return Users
            .findById(userId)
            .then((user) => {
                return user.cleanSession();
            });
    }
};

module.exports = Session;
