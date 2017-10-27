app.factory('chatService', ['localStorageService', '$rootScope',
    (localStorageService, $rootScope) => {
        var chatsData = {
            chats: []
        };
        var socket;
        var counters = {};

        return {
            connect: connect,
            messageToNewChat: messageToNewChat,
            getChatsWithUser: getChatsWithUser,
            messageToExistChat: messageToExistChat,
            loadMessages: loadMessages,
            chatsData: chatsData
        };

        function connect() {
            socket = io.connect({
                query: {
                    token: localStorageService.cookie.get('token')
                }
            });

            socket.on('successConnection', (data) => {
                chatsData.chats = data.chats;
                $rootScope.$digest();

                socket.on('messageForClient', (data) => {
                    setMessageToChat(data);
                });

                socket.on('newChatForClient', (newChat) => {
                    addNewChat(newChat);
                });

                socket.removeAllListeners('successConnection');
            });
        }

        function messageToNewChat(text, recipientId) {
            return new Promise((resolve) => {
                socket.on('newChatCreated', (newChat) => {
                    addNewChat(newChat);
                    socket.removeAllListeners('newChatCreated');
                    resolve();
                });

                socket.emit('messageToNewChat', {
                    token: localStorageService.cookie.get('token'),
                    text: text,
                    recipientId: recipientId
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

        function addNewChat(newChat) {
            counters[newChat.id] = 1;
            chatsData.chats.push(newChat);
            $rootScope.$digest();
        }

        function setMessageToChat(data) {
            if (!counters[data.ChatId])
                return;

            chatsData.chats.forEach((chat) => {
                if (chat.id == data.ChatId) {
                    if (!chat.Messages)
                        chat.Messages = [];

                    chat.Messages.push(data);
                    counters[data.ChatId]++;
                    $rootScope.$digest();

                    return;
                }
            });
        }

        function setMessagesToChat(chatId, messages) {
            counters[chatId] = counters[chatId] + 101;

            chatsData.chats.forEach((chat) => {
                if (chat.id == chatId) {
                    if (!chat.Messages)
                        chat.Messages = [];

                    Array.prototype.push.apply(chat.Messages, messages);

                    $rootScope.$digest();

                    return;
                }
            });
        }

        function getChatsWithUser(userId) {
            var chatsWithUser = [];

            chatsData.chats.forEach((chat) => {
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