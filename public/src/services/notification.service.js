app.factory('notificationService', ['$timeout', '$state',
    ($timeout, $state) => {
        var notifications = [];
        var notificationId = 0;

        return {
            notifications: notifications,
            add: add,
            remove: remove
        };

        function add(item) {
            if ($state.current.name === "chat")
                return;

            item.id = notificationId;

            notifications.push(item);
            notificationId++;

            $timeout(function () {
                remove(item.id);
            }, 3000);
        }

        function remove(id) {
            notifications.forEach(function (elem, index) {
                if (elem.id === id) {
                    notifications.splice(index, 1);
                }
            });
        }
    }
]);
