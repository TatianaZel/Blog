app.factory('chatService', [
    () => {
        return {
            connect: connect
        };

        function connect(id) {
            console.log(id);

            const socket = io({
                query: {
                    userId: id
                }
            });

            socket.on('resiep_msg', function (data) {
                console.log(data);
            });

            //socket.emit('send_msg', {senderId: id, recipientId: id, msg: 'massageeee'});

        }
    }
]);
