app.factory('profileService', ['requestService', 'urls', 'authService', 'localStorageService', function (requestService, urls, authService, localStorageService) {
        let userInfo = {},
            myInfo = {},
            errorGettingMessages = {},
            errorEdittingMessages = {},
            reqData = {
                isSendingNow: false
            };

    function getUserInfo(userId) {
        return new Promise(() => {
            requestService.sendRequest(urls.members + userId, 'get').then(getInfoSuccess, getInfoError);

            function getInfoSuccess(response) {
                if (response && response.data) {
                    userInfo.name = response.data.name;
                    userInfo.surname = response.data.surname;
                    userInfo.description = response.data.description;
                    userInfo.id = response.data.id;
                }
            }

            function getInfoError(error) {
                errorGettingMessages.gettingUserInfo = error;
                userInfo.name = '';
                userInfo.surname = '';
                userInfo.description = '';
                userInfo.id = '';
            }
        });
    }

    function getMyInfo() {
        var headers = {
            'Token': authService.authData.token
        };

        return new Promise(() => {
            requestService.sendRequest(urls.myProfile, 'get', headers).then(getInfoSuccess, getInfoError);

            function getInfoSuccess(response) {
                if (response && response.data) {
                    myInfo.name = response.data.name;
                    myInfo.surname = response.data.surname;
                    myInfo.description = response.data.description;
                    myInfo.id = response.data.id;
                    myInfo.password = response.data.password;
                    myInfo.email = response.data.email;
                }
            }

            function getInfoError(err) {
                errorGettingMessages.gettingUserInfo = err;
                myInfo.name = '';
                myInfo.surname = '';
                myInfo.description = '';
                myInfo.id = '';
                myInfo.password = '';
                myInfo.email = '';
            }
        });
    }

    function editProfile(editedProfile) {
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

            requestService.sendRequest(urls.members + authService.authData.userId, 'put', headers, editedProfile, config).then(editProfileSuccess, editProfileError);

            function editProfileSuccess() {
                authService.authData.email = editedProfile.email;
                localStorageService.cookie.set('email', editedProfile.email);
                reqData.isSendingNow = false;
                resolve();
            }

            function editProfileError(err) {
                reqData.isSendingNow = false;
                errorEdittingMessages.editProfile = err;
            }
        });
    }

    return {
        getUserInfo: getUserInfo,
        getMyInfo: getMyInfo,
        userInfo: userInfo,
        myInfo: myInfo,
        errorGettingMessages: errorGettingMessages,
        errorEdittingMessages: errorEdittingMessages,
        editProfile: editProfile,
        reqData: reqData
    };

}]);
