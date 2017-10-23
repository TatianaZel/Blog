app.factory('chatService', ['localStorageService',
    (localStorageService) => {
        var chats = [];
        var socket;

        return {
            connect: connect,
            beginChat: beginChat,
            addUserToChat: addUserToChat,
            getChatsWithUser: getChatsWithUser,
            sendMessage: sendMessage,
            chats: chats
        };

        function connect() {
            socket = io.connect({
                query: {
                    token: localStorageService.cookie.get('token')
                }
            });

            socket.on('successConnection', (data) => {
                Array.prototype.push.apply(chats, data.chats);

                socket.on('messageForClient', (data) => {
                    console.log(data);
                });

                socket.removeAllListeners('successConnection');
            });
        }

        function beginChat() {
            return new Promise((resolve) => {
                socket.on('chatCreated', (data) => {
                    data.Users = [];////
                    chats.push(data);
                    socket.removeAllListeners('chatCreated');
                    resolve(data);
                });

                socket.emit('newChat', {
                    token: localStorageService.cookie.get('token')
                });
            });
        }

        function addUserToChat(user, chatId) {//~~~~
            return new Promise((resolve) => {
                socket.on('userAddedToChat', (data) => {
                    socket.removeAllListeners('userAddedToChat');

                    chats.forEach((item) => {
                        if (item.id == chatId)
                            item.Users.push(user);
                    });

                    //добавить юзера в чат!
                    console.log(data);

                    resolve(data);
                });

                socket.emit('addUserToChat', {
                    token: localStorageService.cookie.get('token'),
                    userId: user.id,
                    chatId: chatId
                });
            });
        }

        function sendMessage(text, chatId, id) {
            return new Promise((resolve) => {
                socket.on('messageSended', (data) => {
                    socket.removeAllListeners('messageSended');
                    //добавить сообщение в чат!
                    resolve(data);
                });

                socket.emit('newMessage', {
                    token: localStorageService.cookie.get('token'),
                    text: text,
                    chatId: chatId,
                    author: id
                });
            });
        }

        function getChatsWithUser(userId) {//вынести в фильтр
            var chatsWithUser = [];

            chats.forEach((chat) => {
                var flag = false;
                chat.Users.forEach((user) => {
                    if (user.id === userId)
                        flag = true;
                });
                if (flag)
                    chatsWithUser.push(chat);
            });

            return chatsWithUser;
        }

    }
]);