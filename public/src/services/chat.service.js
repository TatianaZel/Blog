app.factory('chatService', ['localStorageService', '$rootScope', 
    'notificationService', '$state',
    (localStorageService, $rootScope, notificationService, $state) => {
        let chatsData = {chats: []},
            socket,
            resolveMsg,
            resolveChat,
            loading = false,
            selectedChat = {};

        return {
            connect: connect,
            disconnect: disconnect,
            messageToNewChat: messageToNewChat,
            messageToExistChat: messageToExistChat,
            getChatsByUser: getChatsByUser,
            loadMessages: loadMessages,
            selectedChat: selectedChat,
            chatsData: chatsData,
            cleanMsgCounter: cleanMsgCounter
        };

        function connect() {
            return new Promise((resolve, reject) => {
                socket = io.connect({
                            query: {
                                token: localStorageService.cookie.get('token')
                            }
                        });

                socket.on('errorConnection', () => {
                    socket.removeAllListeners('errorConnection');
                    reject();
                });

                socket.on('successConnection', (data) => {
                    reIndexingChats(data.chats);

                    if (selectedChat.id && chatsData.chats[selectedChat.id]) {
                        loadMessages(selectedChat.id);
                        cleanMsgCounter(selectedChat.id);
                    }

                    $rootScope.$digest();

                    socket.on('messageForClient', (msg) => {

                        notificationService.add(
                            {
                                author: msg.author.name + ' ' + msg.author.surname,
                                text: msg.text,
                                chatId: msg.ChatId
                            }
                        );

                        setMessageToChat(msg);

                        if(selectedChat.id && selectedChat.id == msg.ChatId && $state.current.name == "chat") {
                            cleanMsgCounter(msg.ChatId);
                        } else {
                            increaseMsgCounter(msg.ChatId);
                        }

                    });

                    socket.on('newChatForClient', (newChat) => {
                        var msg = newChat.Messages[0];

                        notificationService.add(
                            {
                                author: msg.author.name + ' ' + msg.author.surname,
                                text: msg.text,
                                chatId: msg.ChatId
                            }
                        );

                        newChat.Membership = {counter: 1};//
                        addNewChat(newChat);
                    });

                    socket.on('messageSended', (msg) => {
                        setMessageToChat(msg);
                        resolveMsg ? resolveMsg() : '';
                    });

                    socket.on('newChatCreated', (newChat) => {
                        newChat.Membership = {counter: 0};//
                        addNewChat(newChat);
                        resolveChat ? resolveChat(newChat) : '';
                    });

                    socket.removeAllListeners('successConnection');

                    resolve();
                });
            });
        }

        function reIndexingChats(data) {
            data.forEach((item) => {
                chatsData.chats[item.id] = item;
            });
        }

        function disconnect() {
            chatsData.chats = [];

            socket.removeAllListeners('messageForClient');
            socket.removeAllListeners('newChatForClient');
            socket.removeAllListeners('messageSended');
            socket.removeAllListeners('newChatCreated');

            selectedChat.id = '';

            socket.emit('disconnect');
        }

        function messageToNewChat(text, recipientId) {
            if (!text)
                return;

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
            if (!text)
                return;

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
            if (loading)
                return;

            loading = true;

            return new Promise((resolve) => {
                socket.on('portionOfMessages', (data) => {
                    setMessagesToChat(chatId, data);

                    socket.removeAllListeners('portionOfMessages');
                    loading = false;
                    resolve();
                });

                socket.emit('loadMessages', {
                    token: localStorageService.cookie.get('token'),
                    from: chatsData.chats[chatId].Messages ? chatsData.chats[chatId].Messages.length : 0,
                    chatId: chatId
                });
            });
        }

        function addNewChat(newChat) {
            chatsData.chats[newChat.id] = newChat;
            $rootScope.$digest();
        }

        function setMessageToChat(data) {
            if (!chatsData.chats[data.ChatId].Messages)
                chatsData.chats[data.ChatId].Messages = [];

            chatsData.chats[data.ChatId].Messages.push(data);
            chatsData.chats[data.ChatId].updatedAt = data.createdAt;
            $rootScope.$digest();
        }

        function setMessagesToChat(chatId, messages) {
            if (!chatsData.chats[chatId])
                return;

            if (!chatsData.chats[chatId].Messages)
                chatsData.chats[chatId].Messages = [];

            messages.forEach((m) => {
                chatsData.chats[chatId].Messages.push(m);
            });

            $rootScope.$digest();
        }

        function getChatsByUser(userId) {
            var chatWithUser;

            chatsData.chats.forEach((chat) => {
                chat.Users.forEach((user) => {
                    if (user.id === userId) {
                        chatWithUser = chat;
                        return;
                    }
                });
            });

            return chatWithUser;
        }

        function cleanMsgCounter(chatId) {
            if (!chatId || !chatsData.chats[chatId]) return;

            socket.emit('cleanMsgCounter', {
                token: localStorageService.cookie.get('token'),
                chatId: chatId
            });

            chatsData.chats[chatId].Membership.counter = 0;
        };

        function increaseMsgCounter(chatId) {
            chatsData.chats[chatId].Membership.counter++;
            $rootScope.$digest();
        }
    }
]);
