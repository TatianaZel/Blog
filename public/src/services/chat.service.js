app.factory('chatService', [
    () => {
        var chats = [];
        var socket;

        return {
            connect: connect,
            beginChat: beginChat,
            sendMessage: sendMessage,
            chats: chats
        };

        function connect(id, token) {
            if (!id)
                return;

            socket = io.connect({
                query: {
                    token: token
                }
            });

            socket.on('successConnection', (data) => {
                socket.removeAllListeners('successConnection');
            });

            socket.on('chatCreated', (data) => {
                console.log(data);
            });
        }

        function beginChat(token) {
            socket.emit('newChat', {});
        }

        function sendMessage(senderToken, senderId, recipientId) {
            //socket.emit('clientMsg', {senderId: senderId, senderToken: senderToken, recipientId: recipientId, msg: 'hello!'});
        }

    }
]);