app.component('chatBeginner', {
    bindings: {
        resolve: '<',
        close: '&'
    },
    templateUrl: 'build/views/chat/chat-beginner/chat-beginner.html',
    controller: ['memberListService', 'chatService', '$state', chatBeginnerController]
});

function chatBeginnerController(memberListService, chatService, $state) {
    const $ctrl = this;

    $ctrl.sendMessage = sendMessage;
    $ctrl.members;

    memberListService.getMembers().then(() => {
        $ctrl.members = [];
        memberListService.members.forEach((member) => {
            var flag = false;
            chatService.chatsData.chats.forEach((chat) => {
                chat.Users.forEach((user) => {
                    if (user.id === member.id)
                        flag = true;
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
