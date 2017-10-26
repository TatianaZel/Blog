app.factory('chatService', ['localStorageService', '$rootScope',
    (localStorageService, $rootScope) => {
        var chats = [];
        var socket;
        var counters = {};

        return {
            connect: connect,
            messageToNewChat: messageToNewChat,
            getChatsWithUser: getChatsWithUser,
            messageToExistChat: messageToExistChat,
            loadMessages: loadMessages,
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
                $rootScope.$digest();

                socket.on('messageForClient', (data) => {
                    setMessageToChat(data);
                });

                socket.on('newChatForClient', (newChat) => {
                    chats.push(newChat);
                });

                socket.removeAllListeners('successConnection');
            });
        }

        function messageToNewChat() {
            return new Promise((resolve) => {
                socket.on('newChatCreated', (newChat) => {
                    chats.push(newChat);
                    counters[newChat.id] = 1;
                    socket.removeAllListeners('newChatCreated');
                    resolve(newChat);
                });

                socket.emit('messageToNewChat', {
                    token: localStorageService.cookie.get('token'),
                    text: 'qweqweqwe',
                    recipientId: 5
                });
            });
        }

        function messageToExistChat(text, chatId) {
            return new Promise((resolve) => {
                socket.on('messageSended', (data) => {
                    setMessageToChat(data);
                    socket.removeAllListeners('messageSended');
                    resolve();
                });
                socket.emit('messageToExistChat', {
                    token: localStorageService.cookie.get('token'),
                    text: text,
                    chatId: chatId
                });
            });
        }

        function setMessageToChat(data) {
            counters[data.message.ChatId]++;

            chats.forEach((chat) => {
                if (chat.id == data.message.ChatId) {
                    if (!chat.Messages)
                        chat.Messages = [];

                    chat.Messages.push(data);

                    console.log(chat.Messages);

                    $rootScope.$digest();
                    return;
                }
            });
        }

        function loadMessages(chatId) {
            return new Promise((resolve) => {
                if (!counters[chatId]) {
                    counters[chatId] = 0;
                }

                socket.on('portionOfMessages', (data) => {
                    setMessagesToChat(chatId, data);
                    socket.removeAllListeners('portionOfMessages');
                    resolve();
                });

                socket.emit('loadMessages', {
                    token: localStorageService.cookie.get('token'),
                    from: counters[chatId],
                    chatId: chatId
                });
            });
        }

        function setMessagesToChat(chatId, messages) {
            counters[chatId] = counters[chatId] + 101;

            chats.forEach((chat) => {
                if (chat.id == chatId) {
                    if (!chat.Messages)
                        chat.Messages = [];///////////////////////////////////////////

                    Array.prototype.push.apply(chat.Messages, messages);

                    $rootScope.$digest();

                    return;
                }
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