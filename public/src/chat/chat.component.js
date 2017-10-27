app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', chatController]
});

function chatController(chatService) {
    const $ctrl = this;

    $ctrl.chatsData = chatService.chatsData;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;

    function sendMessage(chatId) {
        chatService.messageToExistChat($ctrl.messageText, chatId);
        $ctrl.messageText = '';
    }

    function selectChat(index) {
        $ctrl.selectedChat = index;
        chatService.loadMessages($ctrl.chatsData.chats[$ctrl.selectedChat].id);
    }
}
