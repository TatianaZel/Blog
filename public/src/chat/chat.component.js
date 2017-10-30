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
    
    function sendMessage(chatId) {
        chatService.messageToExistChat($ctrl.messageText, chatId);
        $ctrl.messageText = '';
    }

    function selectChat(id) {
        $ctrl.selectedChat = id;
        chatService.loadMessages(id);
    }
}
