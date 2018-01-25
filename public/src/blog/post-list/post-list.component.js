app.component('postList', {
    templateUrl: 'build/views/blog/post-list/post-list.html',
    controller: ['postListService', '$stateParams', '$uibModal',
        postListController],
    bindings: {
        authData: '<'
    }
});

function postListController(postListService, $stateParams, $uibModal) {

    postListService.getPosts($stateParams.userId);

    const $ctrl = this;

    $ctrl.posts = postListService.posts;
    $ctrl.userId = $stateParams.userId;
    $ctrl.removePost = removePost;

    $ctrl.openCreatingModal = openCreatingModal;
    $ctrl.openEdditingModal = openEdditingModal;

    function removePost(postId) {
        var rmModal = $uibModal.open({
            size: 'sm',
            templateUrl: 'build/views/blog/post-list/remove-modal.html',
            controllerAs: '$ctrl',
            controller: function() {
                this.removePost = () => {
                    postListService.removePost(postId).then(rmModal.close);
                };
                this.close = rmModal.close;
            }
        });
    }

    function openCreatingModal() {
        $uibModal.open({
            size: 'sm',
            component: 'postModal'
        });
    }

    function openEdditingModal(post) {
        postListService.editedPost = post;
        $uibModal.open({
            size: 'sm',
            component: 'editModal'
        });
    }
}
