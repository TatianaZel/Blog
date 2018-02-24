app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', '$stateParams', '$uibModal', '$location', '$anchorScroll', chatController],
    bindings: {
        authData: '<'
    }
});

function chatController(chatService, $stateParams, $uibModal, $location, $anchorScroll) {
    const $ctrl = this;

    $ctrl.chatsData = chatService.chatsData;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;
    $ctrl.beginChat = beginChat;
    $ctrl.selectedChat = chatService.selectedChat;

    if($stateParams.chatId)
        selectChat($stateParams.chatId);
    else
        $ctrl.selectedChat.id = '';

    function selectChat(id) {
        $ctrl.selectedChat.id = id;
        
        if ($ctrl.chatsData.chats.length) { 
            chatService.loadMessages(id);
            chatService.cleanMsgCounter(id);
        }
                
        $location.hash('bottom');
        $anchorScroll();        
    }

    function sendMessage(chatId) {
        chatService.messageToExistChat($ctrl.messageText, chatId);
        $ctrl.messageText = '';
    }

    function beginChat() {
        $uibModal.open({
            size: 'sm',
            component: 'chatBeginner'
        });
    }
}
