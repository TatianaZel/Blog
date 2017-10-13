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
