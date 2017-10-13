app.factory('requestService', ['$http', '$q', function ($http, $q) {
    return {
        sendRequest: sendRequest
    };

    function sendRequest(url, method, headers, sendData, config) {
        var deferred = $q.defer();

        var req = {
            method: method,
            url: url,
            data: sendData ? JSON.stringify(sendData) : '',
            config: config ? config : '',
            headers: headers ? headers : ''
        };

        $http(req).then(
                function (response) {
                    if (response)
                        deferred.resolve(response);
                },
                function (response) {
                    if (response)
                        deferred.reject(response.data.message);
                });

        return deferred.promise;
    }
}]);
