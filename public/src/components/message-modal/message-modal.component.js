app.component('messageModal', {
    templateUrl: 'build/views/components/message-modal/message-modal.html',
    bindings: {
        close: '&'
    },
    controller: ['chatService', modalController]
});

function modalController(chatService) {
    let $ctrl = this;

    $ctrl.sendMessage = sendMessage;

    function sendMessage(messageData) {
        $ctrl.sendingIsNow = true;

        var chatWithUser = chatService.getChatsByUser(scope.member.id);

        if (!chatWithUser) {
            chatService.messageToNewChat(messageData.text, scope.member.id)
                .then(() => {
                    $ctrl.close();
                });
        }
        else {
            chatService.messageToExistChat(messageData.text, chatWithUser.id)
                .then(() => {
                    $ctrl.close();
                });
        }
    }
}
