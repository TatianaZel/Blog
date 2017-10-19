app.factory('authService', ['localStorageService', 'requestService', 'urls', 'socketService',
    (localStorageService, requestService, urls, socketService) => {

        var config = {
            headers: {
                'Content-Type': 'application/jsone;'
            }
        };

        var authData = {
            token: localStorageService.cookie.get('token'),
            email: localStorageService.cookie.get('email'),
            userId: localStorageService.cookie.get('userId')
        },
                reqData = {
                    isSendingNow: false
                },
                errorSignInMessages = {},
                errorSignOutMessages = {},
                errorSignUpMessages = {};

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
                requestService.sendRequest(urls.signIn, 'post', null, sendData, config).then(signInSuccess, signInError);

                function signInSuccess(response) {
                    reqData.isSendingNow = false;
                    if (response.data && response.data.token && response.data.userId) {
                        authData.token = response.data.token;
                        authData.userId = response.data.userId;
                        if (response.config && response.config.data) {
                            authData.email = JSON.parse(response.config.data).email;
                        } else {
                            authData.email = '';
                        }
                        localStorageService.cookie.set('token', authData.token);
                        localStorageService.cookie.set('email', authData.email);
                        localStorageService.cookie.set('userId', authData.userId);
                        errorSignInMessages.signIn = '';
                        signUpResolve ? signUpResolve() : '';

                        socketService.connect(authData.userId, authData.token);///

                        resolve();
                    } else {
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
                requestService.sendRequest(urls.signUp, 'post', null, sendData, config).then(signUpSuccess, signUpError);

                function signUpSuccess(response) {
                    reqData.isSendingNow = false;
                    if (response.config && response.config.data) {
                        signIn(JSON.parse(response.config.data), signUpResolve);
                        errorSignUpMessages.signUp = '';
                    } else {
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

                requestService.sendRequest(urls.signOut, 'post', headers).then(signOutSuccess, signOutError);

                function signOutSuccess() {
                    localStorageService.cookie.remove('token');
                    localStorageService.cookie.remove('email');
                    localStorageService.cookie.remove('userId');
                    authData.token = '';
                    authData.email = '';
                    authData.userId = '';
                    resolve();
                }

                function signOutError() {
                    reject();
                }
            });
        }
    }
]);
