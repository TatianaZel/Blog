app.directive("sendMessageTo", ['chatService', '$uibModal', '$uibModalStack',
    messageModalSwitch]);

function messageModalSwitch(chatService, $uibModal) {
    return {
        restrict: 'A',
        scope: {
            member: "=sendMessageTo"
        },
        link: function (scope, element) {
            let modal;

            element.bind('click', () => {
                modal = $uibModal.open({
                    templateUrl: 'build/views/components/message-modal/message-modal.html',
                    size: 'sm',
                    controller: modalController,
                    controllerAs: '$ctrl'
                });
            });

            function modalController() {
                let $ctrl = this;

                $ctrl.sendMessage = sendMessage;
                $ctrl.close = () => {
                    modal.close();
                };

                function sendMessage(messageData) {
                    $ctrl.sendingIsNow = true;

                    var chatWithUser = chatService.getChatsByUser(scope.member.id);

                    if (!chatWithUser) {
                        chatService.messageToNewChat(messageData.text, scope.member.id)
                            .then(() => {
                                modal.close();
                            });
                    }
                    else {
                        chatService.messageToExistChat(messageData.text, chatWithUser.id)
                            .then(() => {
                                modal.close();
                            });
                    }
                }
            }
        }
    };
}
