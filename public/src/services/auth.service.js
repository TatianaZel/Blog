app.factory('authService', ['localStorageService', 'requestService', 'urls',
    'chatService',
    (localStorageService, requestService, urls, chatService) => {

        var config = {
                headers: {
                    'Content-Type': 'application/jsone;'
                }
            };

        var authData = {
                token: localStorageService.cookie.get('token'),
                email: localStorageService.cookie.get('email'),
                id: localStorageService.cookie.get('id'),
                name: localStorageService.cookie.get('name'),
                surname: localStorageService.cookie.get('surname')
            },
            reqData = {
                isSendingNow: false
            },
            errorSignInMessages = {},
            errorSignOutMessages = {},
            errorSignUpMessages = {};

        if (authData.token && authData.id) {
            chatService.connect(authData.id, authData.token).catch(cleanAuthData);//cleaning of storage is session is not exist
        }

        return {
            signIn: signIn,
            signUp: signUp,
            signOut: signOut,
            authData: authData,
            reqData: reqData,
            errorSignInMessages: errorSignInMessages,
            errorSignOutMessages: errorSignOutMessages,
            errorSignUpMessages: errorSignUpMessages
        };

        function signIn(sendData, signUpResolve) {
            return new Promise((resolve, reject) => {
                reqData.isSendingNow = true;
                requestService.sendRequest(urls.signIn, 'post', null, sendData, config)
                    .then(signInSuccess, signInError);

                function signInSuccess(response) {
                    reqData.isSendingNow = false;

                    if (response.data && response.data.token && response.data.id) {
                        authData.token = response.data.token;
                        authData.id = response.data.id;
                        authData.name = response.data.name;
                        authData.surname = response.data.surname;
                        authData.email = response.data.email;

                        localStorageService.cookie.set('token', authData.token);
                        localStorageService.cookie.set('id', authData.id);
                        localStorageService.cookie.set('name', authData.name);
                        localStorageService.cookie.set('surname', authData.surname);
                        localStorageService.cookie.set('email', authData.email);

                        errorSignInMessages.signIn = '';
                        signUpResolve ? signUpResolve() : '';

                        chatService.connect(authData.userId, authData.token);

                        resolve();
                    }
                    else {
                        errorSignInMessages.signIn = 'Some error. Please, try sign in again.';
                        reject();
                    }
                }

                function signInError(response) {
                    reqData.isSendingNow = false;
                    errorSignInMessages.signIn = response;
                    reject();
                }
            });
        }

        function signUp(sendData) {
            return new Promise((signUpResolve, reject) => {
                reqData.isSendingNow = true;
                requestService.sendRequest(urls.signUp, 'post', null, sendData, config)
                    .then(signUpSuccess, signUpError);

                function signUpSuccess(response) {
                    reqData.isSendingNow = false;
                    if (response.config && response.config.data) {
                        signIn(JSON.parse(response.config.data), signUpResolve);
                        errorSignUpMessages.signUp = '';
                    }
                    else {
                        errorSignUpMessages.signUp = 'Some error. Please, try sign up again.';
                        reject();
                    }
                }

                function signUpError(response) {
                    reqData.isSendingNow = false;
                    errorSignUpMessages.signUp = response;
                    reject();
                }
            });
        }

        function signOut() {
            return new Promise((resolve, reject) => {
                var headers = {
                    'Token': authData.token
                };

                requestService.sendRequest(urls.signOut, 'post', headers)
                    .then(signOutSuccess, signOutError);

                function signOutSuccess() {
                    chatService.disconnect();
                    cleanAuthData();
                    resolve();
                }

                function signOutError() {
                    cleanAuthData();
                    reject();
                }
            });
        }

        function cleanAuthData() {
            localStorageService.cookie.remove('token');
            localStorageService.cookie.remove('email');
            localStorageService.cookie.remove('id');
            localStorageService.cookie.remove('name');
            localStorageService.cookie.remove('surname');

            authData.token = '';
            authData.email = '';
            authData.id = '';
            authData.name = '';
            authData.surname = '';
        }
    }
]);
