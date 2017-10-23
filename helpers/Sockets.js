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
    var userId;

    Session
            .check(query.token)
            .then((user) => {
                if (user) {
                    userId = user.id;

                    socket.join(userId);

                    let opt = {
                        where: {
                            id: userId
                        },
                        include: [
                            {
                                model: Chats,
                                include: [Users]
                            }
                        ]
                    };

                    Users
                            .findAll(opt)
                            .then((users) => {
                                socket.on('newChat', createChat);
                                socket.on('addUserToChat', addUserToChat);
                                socket.on('newMessage', messageProcessing);
                                io.to(userId).emit('successConnection', {
                                    chats: users[0].Chats
                                });
                            });
                }
            })
            .catch((err) => {
                console.log(err);
            });

    function createChat() {//добавить проверку на существование сессии
        let chat = new Chats();

        chat
                .save()
                .then(() => {
                    io.to(userId).emit('chatCreated', chat);
                })
                .catch((err) => {
                    console.log(err);
                });
    }

    function addUserToChat(data) {//добавить проверку на существование сессии
        let ms = new Memberships({//просто передавать data
            UserId: data.userId,
            ChatId: data.chatId
        });

        ms
                .save()
                .then(() => {
                    io.to(userId).emit('userAddedToChat', {
                        addedUser: data.userId
                    });
                });
    }

    function messageProcessing(data) {//добавить проверку на существование сессии
        let msg = new Messages({
            text: data.text,
            ChatId: data.chatId,
            author: data.author
        });

        msg
                .save()
                .then(() => { //отправить всем участникам чата нотификейшн

                    
                    io.to(userId).emit('messageSended', data);
                });
    }
}

module.exports = Chat;
