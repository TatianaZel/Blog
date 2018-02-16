app.factory('requestService', ['$http', '$q',
    ($http, $q) => {
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
                (response) => {
                    if (response)
                        deferred.resolve(response);
                },
                (error) => {
                    if (error)
                        deferred.reject(error.data.message);
            });

            return deferred.promise;
        }
    }
]);
