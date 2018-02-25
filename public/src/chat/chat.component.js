app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', '$stateParams', '$uibModal', '$location', '$anchorScroll', 'orderByFilter',  chatController],
    bindings: {
        authData: '<'
    }
});

function chatController(chatService, $stateParams, $uibModal, $location, $anchorScroll, orderByFilter) {
    const $ctrl = this;

    $ctrl.chatsData = chatService.chatsData;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;
    $ctrl.beginChat = beginChat;
    $ctrl.selectedChat = chatService.selectedChat;
    $ctrl.loadMessages = loadMessages;

    if($stateParams.chatId)
        selectChat($stateParams.chatId);
    else
        $ctrl.selectedChat.id = '';

    function selectChat(id) {
       
        if ($ctrl.chatsData.chats.length) {

            if (!$ctrl.chatsData.chats[id].Messages) {
                chatService.loadMessages(id, 'bottom');
            } else {
                $location.hash('1');
                $anchorScroll();
            }
            
            chatService.cleanMsgCounter(id);
        }

        $ctrl.selectedChat.id = id;
        $location.path('/chat/' + id);
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
    
    function loadMessages() {
        let scrollTo = $ctrl.chatsData.chats[$ctrl.selectedChat.id].Messages.length - 1;
        chatService.loadMessages($ctrl.selectedChat.id, scrollTo);
    }
}
