app.factory('chatService', ['localStorageService', '$rootScope', '$anchorScroll', '$location',
    (localStorageService, $rootScope, $anchorScroll, $location) => {
        let chats = [],
            socket,
            counters = {},
            resolveMsg,
            resolveChat,
            selectedChat = {};

        return {
            connect: connect,
            disconnect: disconnect,
            messageToNewChat: messageToNewChat,
            messageToExistChat: messageToExistChat,
            getChatsByUser: getChatsByUser,
            loadMessages: loadMessages,
            selectedChat: selectedChat,
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

                if (selectedChat.id !== undefined) {
                    loadMessages(selectedChat.id);
                    selectedChat.id = undefined;
                }

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
                counters[item.id] = 0;
            });
        }

        function disconnect() {
            chats.forEach((item) => {
                item = '';
            });

            for (var key in counters) {
                counters[key] = 0;
            }

            socket.removeAllListeners('messageForClient');
            socket.removeAllListeners('newChatForClient');
            socket.removeAllListeners('messageSended');
            socket.removeAllListeners('newChatCreated');

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
            if (!chats[data.ChatId].Messages)
                chats[data.ChatId].Messages = [];

            chats[data.ChatId].Messages.push(data);
            chats[data.ChatId].updatedAt = data.createdAt;
            $rootScope.$digest();

            counters[data.ChatId]++;

            $location.hash('bottom');
            $anchorScroll();
        }

        function setMessagesToChat(chatId, messages) {
            if (!chats[chatId])
                return;

            if (!chats[chatId].Messages)
                chats[chatId].Messages = [];

            counters[chatId] = counters[chatId] + messages.length + 1;

            Array.prototype.push.apply(chats[chatId].Messages, messages);
            $rootScope.$digest();

            $location.hash('bottom');
            $anchorScroll();
        }

        function getChatsByUser(userId) {
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
