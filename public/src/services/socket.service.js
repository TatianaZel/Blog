app.factory('socketService', function () {
    var socket;

    return {
        connect: (id, token) => {///мб лучше брать из локалсторэджа
            if (!id)
                return;

            socket = io.connect({
                query: {
                    userId: id,
                    token: token
                }
            });

            //получение диалогов

            socket.on('newMessage', function (data) {//когда получаем сообщение от кого-то
                console.log(data + ', dear');
            });
        },

        sendMessage: (senderToken, senderId, recipientId) => {//отправить кому-то сообщение

            socket.emit('clientMsg', {senderId: senderId, senderToken: senderToken, recipientId: recipientId, msg: 'hello!'});
        },

        disconnect: () => {

        }
    };
});