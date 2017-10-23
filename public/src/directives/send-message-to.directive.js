app.directive("sendMessageTo", ['chatService', '$uibModal', '$uibModalStack', 'localStorageService', messageModalSwitch]);

function messageModalSwitch(chatService, $uibModal, $uibModalStack, localStorageService) {
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

                $ctrl.chats = chatService.getChatsWithUser(scope.member.id);


                $ctrl.sendMessage = sendMessage;

                function sendMessage(messageData) {
                    let userId = localStorageService.cookie.get('userId');

                    if (!messageData.chat) {
                        chatService.beginChat().then((newChatData) => {

                            chatService.addUserToChat(scope.member, newChatData.id).then(() => {

                                chatService.addUserToChat({id: userId}, newChatData.id).then(() => {//сюда передавать свою инфу

                                    chatService.sendMessage($ctrl.messageData.text, newChatData.id, userId).then((data) => {

                                        $uibModalStack.dismissAll({});
                                    });

                                });

                            });

                        });
                    } else {
                        chatService.sendMessage($ctrl.text, $ctrl.messageData.chat.id, userId).then((data) => {
                            $uibModalStack.dismissAll({});
                        });
                    }
                }

            }
        }
    };
}
