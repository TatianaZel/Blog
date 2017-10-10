//'use strict';
//
//const router = require('express').Router();
//
//const Users = require("../models").User;
//const Membership = require("../models").Membership;
//const Chat = require("../models").Chat;
//const Message = require("../models").Message;
//
//const Session = require("../helpers/Session");
//const ACL = require('../helpers/ACL');
//const HttpError = require("../helpers/HttpError");
//const form = require('express-form2');
//  var field   = form.field;
//
//
//router.get(
//    ['/'],
//
//    // Body validation
//    form(
//        field('email')
//            .required()
//            .trim()
//            .isEmail(),
//
//        field('password')
//            .required()
//    ),
//
//
//    // Controller
//    (req, res, next) => {
//        Users.create({
//            name: 'tanya',
//            surname: 'surname',
//            password: 'password',
//            email: 'email@gmail.com',
//            description: 'test'
//        });
//
//        let chat = new Chat({});
//
//        chat.save().then(() => {
//            let ms = new Membership({
//                UserId: 2,
//                ChatId: chat.id
//            });
//
//            ms.save().then(() => {
//                console.log('done2');
//                let msg = new Message({
//                    ChatId: chat.id,
//                    text: 'test message',
//                    author: '1'
//                });
//
//                msg.save().then(()=>{
//                    console.log('yeah!');
//                    res.send();
//                });
//            });
//
//        });
//
//    }
//);
//
//router.get(
//    ['/test'],
//
//    // Body validation
//    form(
//        field('email')
//            .required()
//            .trim()
//            .isEmail(),
//
//        field('password')
//            .required()
//    ),
//
//
//    // Controller
//    (req, res, next) => {
//
//        Chat.findOne({
//            where: {id: 2},
//            include: [Users]
//        }).then((result)=>{
//            console.log(result.Users);
//        });
//
//    }
//);
//
//module.exports = router;