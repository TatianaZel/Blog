app.factory('memberListService', ['requestService', 'urls',
    (requestService, urls) => {
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
    }
]);
