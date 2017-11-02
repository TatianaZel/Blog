app.factory('notificationService', ['$timeout',
    ($timeout) => {
        var notifications = [];
        var notificationId = 0;

        return {
            notifications: notifications,
            add: add,
            remove: remove
        };

        function add(item) {
            item.id = notificationId;

            Array.prototype.unshift.call(notifications, item);
            notificationId++;

            $timeout(function () {
                remove(item.id);
            }, 7000);
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
