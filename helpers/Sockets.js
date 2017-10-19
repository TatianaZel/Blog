const Session = require("../helpers/Session");

const Chat = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', connection);
};

function connection(socket) {
    var query = socket.request._query ? socket.request._query : {};

    Session
            .check(query.token)
            .then((user) => {
                if (user && user.id == query.userId) {//
                    socket.join(query.userId);
                }
            })
            .catch(() => {
                console.log('some err');
            });

    socket.on('clientMsg', messageProcessing);
}

function messageProcessing(data) {
    Session
            .check(data.senderToken)
            .then((user) => {
                if (user && user.id == data.senderId) {//
                    //запись в бд



                    io.to(data.recipientId).emit('newMessage', data.msg);
                }
            })
            .catch(() => {
                console.log('some err');
            });
}

module.exports = Chat;
