app.component('chatBeginner', {
    bindings: {
        resolve: '<',
        close: '&'
    },
    templateUrl: 'build/views/chat/chat-beginner/chat-beginner.html',
    controller: ['memberListService', 'chatService', '$state', 'localStorageService',
        chatBeginnerController]
});

function chatBeginnerController(memberListService, chatService, $state, localStorageService) {
    const $ctrl = this;

    $ctrl.sendMessage = sendMessage;
    $ctrl.members;
    $ctrl.userId = localStorageService.cookie.get('id');

    memberListService.getMembers().then(() => {
        $ctrl.members = [];
        memberListService.members.forEach((member) => {
            var flag = false;
            chatService.chatsData.chats.forEach((chat) => {
                chat.Users.forEach((user) => {
                    if (user.id === member.id) {
                        flag = true;
                        return;
                    }
                });
            });
            if (!flag)
                $ctrl.members.push(member);
        });
    });

    function sendMessage() {
        chatService.messageToNewChat($ctrl.messageData.text, $ctrl.messageData.memberId)
            .then((newChat) => {
                $ctrl.close();
                $state.go('chat', {chatId: newChat.id});
            });
    }
}
