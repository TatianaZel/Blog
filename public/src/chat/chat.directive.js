app.directive("scrollTop", scrollTopDirective);

function scrollTopDirective() {
    return {
        restrict: 'A',
        scope: {
            handler: "&scrollTop"
        },
        link: function (scope, element) {
            element.on('scroll', function (e) {
                if(e.target.scrollTop === 0) {
                    scope.handler();
                }
            });
        }
    };
}
