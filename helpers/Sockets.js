let io;

const Session = require("../helpers/Session");

const Users = require("../models").User;
const Chats = require("../models").Chat;
const Messages = require("../models").Message;
const Memberships = require("../models").Membership;

const Chat = function (server) {
    io = require('socket.io')(server);
    io.on('connection', connection);
};

function connection(socket) {
    var query = socket.request._query ? socket.request._query : {};

    Session.check(query.token).then((user) => {

        socket.join(user.id);

        let opt = {
            where: {
                id: user.id
            },
            include: [
                {
                    model: Chats,
                    include: [{model: Users, attributes: ['id', 'name', 'surname']}]
                }
            ]
        };

        Users.findOne(opt).then((user) => {

            socket.on('messageToExistChat', addMessageToExistChat);
            socket.on('messageToNewChat', addMessageToNewChat);
            socket.on('loadMessages', getMessagesByChat);
            io.to(user.id).emit('successConnection', {
                chats: user.Chats
            });

        });
    }).catch((err) => {
        console.log(err);
    });

    function addMessageToNewChat(data) {
        Session.check(data.token).then((user) => {
            Chats.create().then((chat) => {
                Memberships.bulkCreate([{UserId: user.id, ChatId: chat.id}, {UserId: data.recipientId, ChatId: chat.id}]).then(() => {

                    let msg = new Messages({
                        text: data.text,
                        ChatId: chat.id,
                        authorId: user.id
                    });

                    msg.save().then(() => {
                        let opt = {
                            where: {
                                id: chat.id
                            },
                            include: [{model: Users, attributes: ['id', 'name', 'surname']}, {model: Messages, include: [{model: Users, as: 'author'}]}]
                        };

                        Chats.findOne(opt).then((chat) => {
                            io.to(data.recipientId).emit('newChatForClient', chat);
                            io.to(user.id).emit('newChatCreated', chat);
                        });
                    });

                });
            });
        });
    }

    function addMessageToExistChat(data) {
        Session.check(data.token).then((user) => {
            Memberships.prototype.check(user.id, data.chatId).then(() => {

                let msg = new Messages({
                    text: data.text,
                    ChatId: data.chatId,
                    authorId: user.id
                });

                msg
                    .save()
                    .then(() => {
                        let msgForSending = {
                            author: user,
                            text: msg.text,
                            ChatId: msg.ChatId,
                            createdAt: msg.createdAt
                        };

                        let opt = {
                            where: {
                                id: data.chatId
                            },
                            include: [Users]
                        };

                        Chats.findOne(opt).then((chat) => {
                            chat.Users.forEach((recipient) => {
                                if (recipient.id != msg.authorId) {
                                    io.to(recipient.id).emit('messageForClient', msgForSending);
                                }
                            });
                        });

                        io.to(msg.authorId).emit('messageSended', msgForSending);
                    });
            });
        });
    }

    function getMessagesByChat(data) {
        Session.check(data.token).then((user) => {
            Memberships.prototype.check(user.id, data.chatId).then(() => {
                let opt = {
                    where: {
                        ChatId: data.chatId
                    },
                    offset: data.from,
                    limit: 100,
                    include: [{model: Users, as: 'author'}]
                };

                Messages
                        .findAll(opt)
                        .then((messages) => {
                            io.to(user.id).emit('portionOfMessages', messages);
                        });
            });
        });
    }
}

module.exports = Chat;
