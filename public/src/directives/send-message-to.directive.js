app.directive("sendMessageTo", ['chatService', '$uibModal', '$uibModalStack', messageModalSwitch]);

function messageModalSwitch(chatService, $uibModal, $uibModalStack) {
    return {
        restrict: 'A',
        scope: {
            member: "=sendMessageTo"
        },
        link: function (scope, element) {
            element.bind('click', () => {
                $uibModal.open({
                    templateUrl: 'build/views/components/message-modal/message-modal.html',
                    size: 'sm',
                    controller: modalController,
                    controllerAs: '$ctrl'
                });
            });

            function modalController() {
                let $ctrl = this;
                $ctrl.chats = chatService.getChatsWithUser(scope.member.id);//сделать фильтром
                $ctrl.sendMessage = sendMessage;

                function sendMessage(messageData) {
                    if (!messageData.chatId) {
                        chatService.messageToNewChat();
                    } else {
                        chatService.messageToExistChat(messageData.text, messageData.chatId).then(() => {
                            $uibModalStack.dismissAll({});
                        });
                    }
                }
            }


        }
    };
}
