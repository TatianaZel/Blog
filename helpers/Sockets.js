let io;

const Session = require('../helpers/Session');

const Users = require('../models').User;
const Chats = require('../models').Chat;
const Messages = require('../models').Message;
const Memberships = require('../models').Membership;

const Chat = function (server) {
    io = require('socket.io')(server);
    io.on('connection', connection);
};

function connection(socket) {
    const query = socket.request._query ? socket.request._query : '';

    if (!query)
        return;

    Session.check(query.token)
            .then((user) => {
                socket.join(user.id);

                Users.getChats(user.id, Chats).then((chats) => {

                    //separation for that case if in the future it will be possible to create chats with more than two users
                    socket.on('messageToExistChat', addMessageToExistChat);
                    socket.on('messageToNewChat', addMessageToNewChat);

                    socket.on('loadMessages', getMessagesByChat);

                    socket.on('cleanMsgCounter', cleanCounter);

                    io.to(user.id).emit('successConnection', {
                        chats
                    });
                });
            })
            .catch(() => {
                socket.emit('errorConnection', {});
            });
}

function addMessageToNewChat(data) {
    Session.check(data.token).then((user) => {
        Memberships
            .checkDialog(user.id, data.recipientId)//here we check whether it was already created a chat between the two users
            .then(() => {
                Chats.create().then((chat) => {
                    Memberships
                        .bulkCreate([
                            {
                                UserId: user.id,
                                ChatId: chat.id,
                                counter: 0
                            },
                            {
                                UserId: data.recipientId,
                                ChatId: chat.id,
                                counter: 1
                            }
                        ])
                        .then(() => {
                            const msg = {
                                text: data.text,
                                ChatId: chat.id,
                                authorId: user.id
                            };

                            Messages.create(msg).then(() => {
                                Chats.getChat(chat.id, Users, Messages)
                                    .then((chat) => {
                                        io.to(data.recipientId)
                                            .emit('newChatForClient', chat);

                                        io.to(user.id)
                                            .emit('newChatCreated', chat);
                                    });
                            });
                        });
                });
            });
    });
}

function addMessageToExistChat(data) {
    Session.check(data.token).then((user) => {
        Memberships.check(user.id, data.chatId).then(() => {//here we check whether the user is participating in this chat

            const msg = {
                text: data.text,
                ChatId: data.chatId,
                authorId: user.id
            };

            Messages.create(msg).then(() => {
                const msgForSending = {
                    author: user,
                    text: msg.text,
                    ChatId: msg.ChatId,
                    createdAt: msg.createdAt
                };

                Chats
                    .update(
                        {},
                        {
                            where: {
                                id: data.chatId
                            }
                        }
                    )
                    .then(() => {
                        io.to(msg.authorId)
                            .emit('messageSended', msgForSending);

                        Chats
                            .getChatUsers(data.chatId, Users)
                            .then((users) => {
                                users.forEach((recipient) => {
                                    if (recipient.id != msg.authorId) {
                                        Memberships
                                                .setCounter(recipient.id, data.chatId, true)
                                                .then(() => {
                                                    io.to(recipient.id).emit('messageForClient', msgForSending);
                                                });
                                    }
                                });
                            });
                    });
            });
        });
    });
}

function getMessagesByChat(data) {
    Session.check(data.token).then((user) => {
        Memberships.check(user.id, data.chatId)
            .then(() => {
                Messages.getMessagesByChat(data.chatId, Users, data.from)
                    .then((messages) => {
                        io.to(user.id).emit('portionOfMessages', messages);
                    });
            })
            .catch(() => {
                io.to(user.id).emit('portionOfMessages', []);
            });
    });
}

function cleanCounter(data) {
    Session.check(data.token).then((user) => {
        Memberships.check(user.id, data.chatId)
            .then(() => {
                Memberships.setCounter(user.id, data.chatId, false);
            });
    });
}

module.exports = Chat;
