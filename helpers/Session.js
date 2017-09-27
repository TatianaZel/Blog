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
const Sessions = require("../models").Session;

//const HttpError = require("HttpError");

var Session = {
    /**
     * Express middleware to detect and activate session.
     * Define session provider.
     *
     * if sesson not defined, expires, ect
     */
    middleware(req, res, next) {
        Session.check(req).then((user) => {
            req.userId = user._id;
            req.user = user;
            req.session = req.headers.token;
            next();
        }).catch((err) => {
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
        return Sessions.prototype.setSession(userId);
    },
    /**
     * Returns all sessions of user
     *
     * @param token {TokenId} token
     * @returns {Promise ~resolve => session Object}
     */
    get(token) {///???
        console.log('get');

        Sessions.findOne({
            where: {
                token: token
            }
        }).then((session) => {
            if (session) {
                Users.findById(session.UserId).then((user) => {
                    if(user)
                        return user;
                    throw "user not found";
                });
            }
        });
        
    },
    /**
     * Kill the session
     *
     * @param token {TokenId} token
     * @returns {Promise ~resolve => session Object}
     */
    kill(token) {
        return Sessions.removeSession(token);
    }
};

module.exports = Session;
