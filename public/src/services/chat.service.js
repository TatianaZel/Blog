app.factory('chatService', ['localStorageService', '$rootScope', '$anchorScroll', '$location',
    (localStorageService, $rootScope, $anchorScroll, $location) => {
        var chats = []
        var socket;
        var counters = {};
        var resolveMsg;
        var resolveChat;

        return {
            connect: connect,
            disconnect: disconnect,
            messageToNewChat: messageToNewChat,
            messageToExistChat: messageToExistChat,
            getChatsWithUser: getChatsWithUser,
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
                reIndexingChats(data.chats);

                $rootScope.$digest();

                socket.on('messageForClient', (data) => {
                    setMessageToChat(data);
                });

                socket.on('newChatForClient', (newChat) => {
                    addNewChat(newChat);
                });

                socket.on('messageSended', (data) => {
                    setMessageToChat(data);
                    resolveMsg ? resolveMsg() : '';
                });

                socket.on('newChatCreated', (newChat) => {
                    addNewChat(newChat);
                    resolveChat ? resolveChat() : '';
                });

                socket.removeAllListeners('successConnection');
            });
        }

        function reIndexingChats(data) {
            data.forEach((item) => {
                chats[item.id] = item;
            });
        }

        function disconnect() {///
            chats = [];////

            for (var key in counters) {
                counters[key] = 0;
            }
            socket.emit('disconnect');
        }

        function messageToNewChat(text, recipientId) {
            return new Promise((resolve) => {
                resolveChat = resolve;

                socket.emit('messageToNewChat', {
                    token: localStorageService.cookie.get('token'),
                    text: text,
                    recipientId: recipientId
                });
            });
        }

        function messageToExistChat(text, chatId) {
            return new Promise((resolve) => {
                resolveMsg = resolve;
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
            chats[newChat.id] = newChat;
            $rootScope.$digest();
        }

        function setMessageToChat(data) {
            if (!counters[data.ChatId])
                return;

            if (!chats[data.chatId].Messages)
                chats[data.chatId].Messages = [];

            chats[data.chatId].Messages.push(data);
            chats[data.chatId].updatedAt = data.createdAt;
            $rootScope.$digest();

            counters[data.ChatId]++;

            $location.hash('bottom');
            $anchorScroll();
        }

        function setMessagesToChat(chatId, messages) {
            counters[chatId] = counters[chatId] + messages.length + 1;

            if (!chats[chatId].Messages)
                chats[chatId].Messages = [];

            Array.prototype.push.apply(chats[chatId].Messages, messages);
            $rootScope.$digest();

            $location.hash('bottom');
            $anchorScroll();
        }

        function getChatsWithUser(userId) {
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
