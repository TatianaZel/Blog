app.directive("compareTo", compareTo);

function compareTo() {
    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.confirm = (modelValue) => {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", () => {
                ngModel.$validate();
            });
        }
    };
}
