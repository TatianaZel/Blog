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
                let scrollTo = orderByFilter($ctrl.chatsData.chats[id].Messages, 'createdAt').pop().id;
                $location.hash(scrollTo);
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
        let scrollTo = orderByFilter($ctrl.chatsData.chats[$ctrl.selectedChat.id].Messages, 'createdAt', true).pop().id;
        chatService.loadMessages($ctrl.selectedChat.id, scrollTo);
    }
}
