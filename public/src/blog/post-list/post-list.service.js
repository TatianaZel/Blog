app.factory('postListService', ['requestService', 'authService', 'urls', function (requestService, authService, urls) {
        var posts = [],
            errorMessages = {},
            reqData = {
                isCreatingNow: false,
                removedPost: ''
            },
            editedPost = {},
            config = {
                headers: {
                    'Content-Type': 'application/jsone;'
                }
            };

        return {
            getPosts: getPosts,
            posts: posts,
            reqData: reqData,
            editedPost: editedPost,
            errorMessages: errorMessages,
            removePost: removePost,
            createPost: createPost,
            editPost: editPost
        };

        function getPosts(userId) {
            return new Promise((resolve, reject) => {
                posts.splice(0, posts.length);
                requestService.sendRequest(urls.blog + userId, 'get').then(getPostsSuccess, getPostsError);
                function getPostsSuccess(res) {
                    if (res.data) {
                        Array.prototype.push.apply(posts, res.data);
                        errorMessages.gettingPosts = '';
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

        function editPost(id, sendData) {
            return new Promise((resolve, reject) => {
                var headers = {
                    'Token': authService.authData.token
                };

                reqData.isCreatingNow = true;

                requestService.sendRequest(urls.post + id, 'put', headers, sendData, config).then(editPostSuccess, editPostError);

                function editPostSuccess(res) {
                    reqData.isCreatingNow = false;
                    errorMessages.creatingPost = '';
                    resolve();
                }

                function editPostError(err) {
                    errorMessages.edditingPost = err;
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
