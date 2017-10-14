'use strict';

var app = angular.module('app', ['ui.router', 'ui.router.state.events', 'LocalStorageModule', 'ui.bootstrap']).run(['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.data && toState.data.auth) {
            if (toState.data.auth === 'Anonymous' && localStorageService.cookie.get('token')) {
                event.preventDefault();
                return false;
            }
            if (toState.data.auth === 'Authorized' && !localStorageService.cookie.get('token')) {
                event.preventDefault();
                return false;
            }
        }
    });
}]);

app.factory('memberListService', ['requestService', 'urls', function (requestService, urls) {
    var members = [];

    return {
        getMembers: getMembers,
        members: members
    };

    function getMembers() {
        return new Promise(function (resolve, reject) {
            requestService.sendRequest(urls.members, 'get').then(getMembersSuccess, getMembersError);

            function getMembersSuccess(res) {
                if (res.data) {
                    !members.length ? Array.prototype.push.apply(members, res.data) : '';
                    resolve();
                } else {
                    //errorMessages.gettingPosts = 'No available posts.';
                    reject();
                }
            }

            function getMembersError(err) {
                //errorMessages.gettingPosts = response;
                reject();
            }
        });
    }
}]);

app.factory('authService', ['localStorageService', 'requestService', 'urls', function (localStorageService, requestService, urls) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (signUpResolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
}]);

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

var urls = {
    blog: 'http://localhost:3000/api/blog/',
    signIn: 'http://localhost:3000/api/auth/signin/',
    signUp: 'http://localhost:3000/api/auth/signup/',
    signOut: 'http://localhost:3000/api/auth/logout/',
    myProfile: 'http://localhost:3000/api/user/getOwnInfo/',
    members: 'http://localhost:3000/api/user/',
    post: 'http://localhost:3000/api/post/'
};
app.constant("urls", urls);

app.factory('postListService', ['requestService', 'authService', 'urls', function (requestService, authService, urls) {
    var posts = [],
        errorMessages = {},
        reqData = {
            isCreatingNow: false,
            removedPost: ''
        },
        config = {
            headers: {
                'Content-Type': 'application/jsone;'
            }
        };

    return {
        getPosts: getPosts,
        posts: posts,
        reqData: reqData,
        errorMessages: errorMessages,
        removePost: removePost,
        createPost: createPost
    };

    function getPosts(userId) {
        return new Promise((resolve, reject) => {
            posts.splice(0, posts.length);
            requestService.sendRequest(urls.blog + userId, 'get').then(getPostsSuccess, getPostsError);
            function getPostsSuccess(res) {
                if (res.data) {
                    Array.prototype.push.apply(posts, res.data);
                    resolve();
                } else {
                    errorMessages.gettingPosts = 'No available posts.';
                    reject();
                }
            }

            function getPostsError(err) {
                errorMessages.gettingPosts = err;
                reject();
            }
        });
    }

    function createPost(sendData) {
        return new Promise((resolve, reject) => {
            var headers = {
                    'Token': authService.authData.token
                };

            reqData.isCreatingNow = true;

            requestService.sendRequest(urls.post, 'post', headers, sendData, config).then(createPostSuccess, createPostError);

            function createPostSuccess(res) {
                reqData.isCreatingNow = false;
                if (res.data) {
                    posts.push(res.data);
                    errorMessages.creatingPost = '';
                    errorMessages.gettingPosts = '';
                    resolve();
                } else {
                    errorMessages.creatingPost = 'Somthing error. Please, try reload page.';
                    reject();
                }
            }

            function createPostError(err) {
                errorMessages.creatingPost = err;
                reqData.isCreatingNow = false;
                reject();
            }
        });
    }

    function removePost(postId) {
        return new Promise(function (resolve, reject) {
            if (!confirm("Are you sure you want to remove the post?"))
                return;

            var headers = {
                'Token': authService.authData.token
            };

            reqData.removedPost = postId;

            requestService.sendRequest(urls.post + postId, 'delete', headers).then(removePostSuccess, removePostError);

            function removePostSuccess() {
                errorMessages.removingPost = '';
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].id === reqData.removedPost) {
                        posts.splice(i, 1);
                    }
                }
                resolve();
            }

            function removePostError(response) {
                errorMessages.removingPost = response;
                reject();
            }
        });
    }
}]);

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

app.component('auth', {
    templateUrl: 'build/views/auth/auth.html',
    controller: ['authService', '$state', authController]
});

function authController(authService, $state) {
    const $ctrl = this;

    $ctrl.errorSignInMessages = authService.errorSignInMessages;
    $ctrl.errorSignUpMessages = authService.errorSignUpMessages;
    $ctrl.reqAuthData = authService.reqData;
    $ctrl.signIn = signIn;
    $ctrl.signUp = signUp;

    function signUp(userData) {
        authService.signUp(userData).then(function () {
            $state.go('member', {userId: authService.authData.userId})
        });
    }

    function signIn(userData) {
        authService.signIn(userData).then(function () {
            $state.go('member', {userId: authService.authData.userId})
        });
    }
}

app.component('blog', {
    templateUrl: 'build/views/blog/blog.html',
    controller: [blogController],
    bindings: {
        authData: '<'
    }
});

function blogController() {
    const $ctrl = this;
}

app.component('requestErrors', {
    bindings: {
        errors: '='
    },
    template: '<div class="alert alert-danger" role="alert" ng-repeat="(key, value) in $ctrl.errors" ng-if="value"><p class="text-center">{{value}}</p></div>',
    controller: [requestErrorsController]
});

function requestErrorsController() {
    const $ctrl = this;

    $ctrl.$onInit = function () {
        for (var key in $ctrl.errors) {
            $ctrl.errors[key] = '';
        }
    };
}

app.component('validateErrors', {
    bindings: {
        errors: '<',
        show: '<'
    },
    template: '<div class="text-danger" ng-repeat="(key, value) in $ctrl.errors" ng-if="$ctrl.messageToggle(key)">{{$ctrl.messages[key]}}</div>',
    controller: [validateErrorsController]
});

function validateErrorsController() {
    const $ctrl = this;

    $ctrl.messages = {
        required: '* This field is required',
        minlength: '* Too short value',
        maxlength: '* Too long value',
        email: '* Email is not valid',
        confirm: '* Passwords are not the same'
    };
    $ctrl.messageToggle = messageToggle;

    function messageToggle(key) {
        if (key === 'confirm' && Object.keys($ctrl.errors).length > 1)
            return false;

        if ($ctrl.show)
            return true;

        return false;
    }
}

app.component('layout', {
    templateUrl: 'build/views/layout/layout.html',
    controller: ['authService', layoutController]
});

function layoutController(authService) {
    const $ctrl = this;

    $ctrl.authData = authService.authData;
    $ctrl.errorSignOutMessages = authService.errorSignOutMessages;
    $ctrl.signOut = authService.signOut;
}

app.component('memberList', {
    templateUrl: 'build/views/member-list/member-list.html',
    controller: ['memberListService', memberListController],
});

function memberListController(memberListService) {
    const $ctrl = this;

    $ctrl.members = memberListService.members;

    memberListService.getMembers();
}

app.component('postList', {
    templateUrl: 'build/views/blog/post-list/post-list.html',
    controller: ['postListService', '$stateParams', '$uibModal', postListController],
    bindings: {
        authData: '<'
    }
});

function postListController(postListService, $stateParams, $uibModal) {

    postListService.getPosts($stateParams.userId);

    const $ctrl = this;

    $ctrl.posts = postListService.posts;
    $ctrl.userId = $stateParams.userId;
    $ctrl.removePost = postListService.removePost;
    $ctrl.openCreatingModal = openCreatingModal;
    $ctrl.openEdditingModal = openEdditingModal;


    function openCreatingModal() {
        $uibModal.open({
            component: 'postModal',
            resolve: {
                submitFunc: ['postListService', (postListService) => {
                        return postListService.createPost;
                    }
                ]
            }
        });
    }

    function openEdditingModal() {
        $uibModal.open({
            component: 'postModal'
        });
    }
}

app.component('postModal', {
    templateUrl: 'build/views/blog/post-list/post-modal.html',
    bindings: {
        resolve: '<',
        close: '&'
    },
    controller: ['postListService', (postListService) => {
            const $ctrl = this;

            $ctrl.blogReqData = postListService.reqData;
                console.log($ctrl.resolve);
            $ctrl.submit = function () {

                $ctrl.resolve.submitFunc($ctrl.postData).then($ctrl.close);
            };
        }
    ]
});

app.component('profile', {
    templateUrl: 'build/views/blog/profile/profile.html',
    controller: ['profileService', '$stateParams', profileController],
    bindings: {
        authData: '<'
    }
});

function profileController(profileService, $stateParams) {
    const $ctrl = this;

    $ctrl.errorGettingMessages = profileService.errorGettingMessages;
    $ctrl.info = profileService.userInfo;

    profileService.getUserInfo($stateParams.userId);
}

app.component('profileForm', {
    bindings: {
        title: '@',
        isSendingNow: '<',
        profile: '<',
        submitFunc: '<',
        errors: '<'
    },
    templateUrl: 'build/views/components/profile-form/profile-form.html',
    controller: [profileFormController]
});

function profileFormController() {
    const $ctrl = this;
}

app.directive("compareTo", compareTo);

function compareTo() {
    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.confirm = function (modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
}

app.config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}]);
app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('auth', {
        url: "/auth",
        component: 'auth',
        data: {
            auth: "Anonymous"
        }
    });
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('member', {
        url: "/:userId",
        component: 'blog',
        resolve: {
            authData: ['authService', (authService) => {
                    return authService.authData;
                }
            ]
        }
    });

    $stateProvider.state('editProfile', {
        url: "/editProfile",
        component: 'profileForm',
        resolve: {
            isSendingNow: ['profileService', (profileService) => {
                    return profileService.reqData.isSendingNow;
                }
            ],
            title: [() => {
                    return "Edit profile";
                }
            ],
            errors: ['profileService', (profileService) => {
                    return profileService.errorEdittingMessages;
                }
            ],
            profile: ['profileService', (profileService) => {
                    profileService.getMyInfo();
                    return profileService.myInfo;
                }
            ],
            submitFunc: ['profileService', 'authService', '$state', (profileService, authService, $state) => {
                    return (editedProfile) => {
                        profileService.editProfile(editedProfile).then(() => {
                            $state.go('member', {userId: authService.authData.userId})
                        });
                    };
                }
            ]
        },
        data: {
            auth: "Authorized"
        }
    });
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('members', {
        url: "/",
        component: 'memberList'
    });
}]);
