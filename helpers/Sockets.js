var chat = function (server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {

        socket.join(socket.request._query.userId);

        io.to(socket.request._query.userId).emit('resiep_msg', 'mesageee!');

//        socket.on('send_msg', function (data) {
//            io.to(data.recipientId).emit('resiep_msg', data.msg);
//
//            //запись сообщений в бд
//        });

    });

};

module.exports = chat;
