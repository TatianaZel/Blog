app.factory('postListService', ['requestService', 'authService', 'urls', function (requestService, authService, urls) {
    var posts = [],
        currentPost = {},
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
//        reqData: reqData,
//        currentPost: currentPost,
//        errorMessages: errorMessages,
//        getPost: getPost,
//        removePost: removePost,
        createPost: createPost
    };

    function getPosts(userId) {
        return new Promise((resolve, reject) => {
            requestService.sendRequest(urls.blog + userId, 'get').then(getPostsSuccess, getPostsError);

            function getPostsSuccess(res) {
                if (res.data) {
                    !posts.length ? Array.prototype.push.apply(posts, res.data) : '';
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

//    function removePost(postId) {
//        return new Promise(function (resolve, reject) {
//            if (!confirm("Are you sure you want to remove the post?"))
//                return;
//
//            var headers = {
//                'Token': authService.authData.token
//            };
//
//            reqData.removedPost = postId;
//
//            requestService.sendRequest(urls.blog + postId, 'delete', headers).then(removePostSuccess, removePostError);
//
//            function removePostSuccess() {
//                errorMessages.removingPost = '';
//                for (var i = 0; i < posts.length; i++) {
//                    if (posts[i].id === reqData.removedPost) {
//                        posts.splice(i, 1);
//                    }
//                }
//                resolve();
//            }
//
//            function removePostError(response) {
//                errorMessages.removingPost = response;
//                reject();
//            }
//        });
//    }
//
//    function getPost(postId) {
//        return new Promise(function (resolve, reject) {
//            var headers = {
//                'Token': authService.authData.token
//            };
//
//            requestService.sendRequest(urls.blog + postId, 'get', headers).then(getPostSuccess, getPostError);
//
//            function getPostSuccess(response) {
//                if (response.data) {
//                    for (var key in response.data) {
//                        currentPost[key] = response.data[key];
//                    }
//                    resolve();
//                } else {
//                    cleanObject(currentPost);
//                    errorMessages.gettingPost = 'Can not get this post.';
//                    reject();
//                }
//            }
//
//            function getPostError(response) {
//                cleanObject(currentPost);
//                errorMessages.gettingPost = response;
//                reject();
//            }
//        });
//    }
//
//    function cleanObject(obj) {
//        for (var key in obj) {
//            obj[key] = '';
//        }
//    }
}]);
