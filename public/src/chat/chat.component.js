app.component('chat', {
    templateUrl: 'build/views/chat/chat.html',
    controller: ['chatService', '$stateParams', '$uibModal', '$location', '$anchorScroll', '$timeout', chatController],
    bindings: {
        authData: '<'
    }
});

function chatController(chatService, $stateParams, $uibModal, $location, $anchorScroll, $timeout) {
    const $ctrl = this;

    let scrollTo = 1;

    $ctrl.chatsData = chatService.chatsData;
    $ctrl.selectChat = selectChat;
    $ctrl.sendMessage = sendMessage;
    $ctrl.beginChat = beginChat;
    $ctrl.selectedChat = chatService.selectedChat;
    $ctrl.loadMessages = loadMessages;
    $ctrl.scrollToFunc = scrollToFunc;

    if($stateParams.chatId)
        selectChat($stateParams.chatId);
    else
        $ctrl.selectedChat.id = '';

    function selectChat(id) {
        scrollTo = '1';
        $ctrl.selectedChat.id = id;

        if(!$ctrl.chatsData.chats[id]) return;

        if (!$ctrl.chatsData.chats[id].Messages) {
            chatService.loadMessages(id);
        }

        chatService.cleanMsgCounter(id);
    }

    function sendMessage(chatId) {
        scrollTo = '1';
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
        if ($ctrl.chatsData.chats[$ctrl.selectedChat.id].Messages) {
            scrollTo = $ctrl.chatsData.chats[$ctrl.selectedChat.id].Messages.length;
            chatService.loadMessages($ctrl.selectedChat.id);
        }
    }

    function scrollToFunc() {
        $timeout(() => {
            $location.hash(scrollTo);
            $anchorScroll();
        }, 0);
    }
}
