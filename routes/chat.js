"use strict";

const router = require("express").Router();
const Posts = require("../models").Post;
const Membership = require("../models").Membership;
const Users = require("../models").User;
const Chat = require("../models").Chat;
const ACL = require("../helpers/ACL");
const HttpError = require("../helpers/HttpError");
const Session = require("../helpers/Session");

router.get(
    ['/'],

    ACL(),

    // Controller
    (req, res, next) => {
        Users.findAll({
                where: {
                    id: req.userId
                },
                include: [{
                        model: Chat,
                        include: [Users]
                    }]
            })
            .then((user) => {
                res.send(user[0].Chats);
            })
            .catch(next);
});

router.post(
    ['/'],

    ACL(),

    // Controller
    (req, res, next) => {

        let chat = new Chat();

        chat.save().then(() => {
            let ms = new Membership({
                ChatId: 4,
                UserId: 5
            });

            ms.save().then(() => {
                res.send({});
            }).catch(next);
        }).catch(next);
});


// Params
router.param('chatId', (req, res, next, chatId) => {
    if ((chatId ^ 0) != chatId) {
        return next(new HttpError(416, "Chat id is not valid"));
    }

    next();
});

module.exports = router;
