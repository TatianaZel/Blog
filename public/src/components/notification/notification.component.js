app.component('notificationMessages', {

    templateUrl: 'build/views/components/notification/notification.html',
    controller: ['notificationService', '$state', notificationController]
});

function notificationController(notificationService, $state) {
    const $ctrl = this;

    $ctrl.notifications = notificationService.notifications;
    $ctrl.remove = notificationService.remove;
    $ctrl.openChat = openChat;

    function openChat(chatId, notificationId) {
        $state.go('chat', {chatId: chatId});
        notificationService.remove(notificationId);
    }
}
