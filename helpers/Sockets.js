let io;

const Session = require("../helpers/Session");

const Users = require("../models").User;
const Chats = require("../models").Chat;
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
                    socket.join(user.id);

                    userId = user.id;

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

                    Users.findAll(opt)
                            .then((users) => {
//                                socket.on('newChat', createChat);
//                                socket.on('addPeopleToChat', addPeopleToChat);
//                                socket.on('clientMsg', messageProcessing);
                                io.to(userId).emit('successConnection', users[0].Chats);
                            });
                }
            })
            .catch((err) => {
                console.log(err);
            });

    function createChat() {
        let chat = new Chats();

        chat.save()
            .then(() => {
                io.to(userId).emit('chatCreated', chat);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function addPeopleToChat(data) {//тут как-то создавать несколько записей в мемберщип одновременно или по одному(лучше по одному)  и по резолву файрить событие в котором возвращать

    }

    function messageProcessing() {

    }
}

module.exports = Chat;
