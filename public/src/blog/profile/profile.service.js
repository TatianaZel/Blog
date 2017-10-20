app.factory('profileService', ['requestService', 'urls', 'authService', 'localStorageService',
    (requestService, urls, authService, localStorageService) => {
        let userInfo = {},
            notice = {
                errorGettingMessages: {},
                errorProfileMessages: {},
                errorPasswordMessages: {},
                successProfileMessages: {},
                successPasswordMessages: {}
            },
            reqData = {
                isSendingNow: false
            };

        function getUserInfo(userId) {
            return new Promise(() => {
                requestService.sendRequest(urls.members + userId, 'get')
                        .then(getInfoSuccess, getInfoError);

                function getInfoSuccess(response) {
                    if (response && response.data) {
                        notice.errorGettingMessages.gettingUserInfo = '';
                        userInfo.name = response.data.name;
                        userInfo.surname = response.data.surname;
                        userInfo.description = response.data.description;
                        userInfo.id = response.data.id;
                        userInfo.email = response.data.email;
                    }
                }

                function getInfoError(error) {
                    notice.errorGettingMessages = error;
                    userInfo.name = '';
                    userInfo.surname = '';
                    userInfo.description = '';
                    userInfo.id = '';
                }
            });
        }

        function editProfileData(profileData) {
            var config = {
                    headers: {
                        'Content-Type': 'application/jsone;'
                    }
                },
                headers = {
                    'Token': authService.authData.token
                };

            return new Promise((resolve) => {
                reqData.isSendingNow = true;

                requestService.sendRequest(urls.members + authService.authData.userId, 'put', headers, profileData, config)
                        .then(editProfileSuccess, editProfileError);

                function editProfileSuccess() {
                    authService.authData.email = profileData.email;
                    localStorageService.cookie.set('email', profileData.email);
                    notice.errorProfileMessages.editProfile = '';
                    notice.successProfileMessages.editProfile = 'Success!';
                    reqData.isSendingNow = false;
                    resolve();
                }

                function editProfileError(err) {
                    reqData.isSendingNow = false;
                    notice.errorProfileMessages.editProfile = err;
                    notice.successProfileMessages.editProfile = '';
                }
            });
        }

        function changePassword(passwordsData) {
            var config = {
                    headers: {
                        'Content-Type': 'application/jsone;'
                    }
                },
                headers = {
                    'Token': authService.authData.token
                };

            return new Promise((resolve) => {
                reqData.isSendingNow = true;

                requestService.sendRequest(urls.changePassword, 'put', headers, passwordsData, config)
                        .then(editProfileSuccess, editProfileError);

                function editProfileSuccess() {
                    reqData.isSendingNow = false;
                    notice.errorPasswordMessages.changePassword = '';
                    notice.successPasswordMessages.changePassword = 'Success!';
                    resolve();
                }

                function editProfileError(err) {
                    reqData.isSendingNow = false;
                    notice.errorPasswordMessages.changePassword = err;
                    notice.successPasswordMessages.changePassword = '';
                }
            });
        }

        return {
            getUserInfo: getUserInfo,
            editProfileData: editProfileData,
            changePassword: changePassword,
            userInfo: userInfo,
            notice: notice,
            reqData: reqData
        };
    }
]);
