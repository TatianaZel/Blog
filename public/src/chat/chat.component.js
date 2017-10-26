app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', chatController]
});

function chatController(chatService) {
    const $ctrl = this;

    $ctrl.chats = chatService.chats;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;

    function sendMessage(chatId) {
        chatService.messageToExistChat($ctrl.messageText, chatId);
        $ctrl.messageText = '';
    }

    function selectChat(index) {
        $ctrl.selectedChat = index;

        if (!$ctrl.chats[$ctrl.selectedChat].Messages)
            chatService.loadMessages($ctrl.chats[$ctrl.selectedChat].id);

    }
}
