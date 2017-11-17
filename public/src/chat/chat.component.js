app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', '$stateParams', chatController]
});

function chatController(chatService, $stateParams) {
    const $ctrl = this;

    $ctrl.chatsData = chatService.chatsData;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;

    selectChat($stateParams.chatId);

    function selectChat(id) {
        $ctrl.selectedChat = id;

        if (!$ctrl.chatsData.chats.length)
            chatService.selectedChat.id = id;
        else
            chatService.loadMessages(id);
    }

    function sendMessage(chatId) {
        chatService.messageToExistChat($ctrl.messageText, chatId);
        $ctrl.messageText = '';
    }
}
