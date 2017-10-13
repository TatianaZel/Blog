app.component('postList', {
    templateUrl: 'build/views/blog/post-list/post-list.html',
    controller: ['postListService', '$stateParams', '$uibModal', postListController],
    bindings: {
        authData: '<'
    }
});

function postListController(postListService, $stateParams, $uibModal) {
    postListService.getPosts($stateParams.userId).then(() => {
        console.log($ctrl.posts);
    });

    const $ctrl = this;

    $ctrl.posts = postListService.posts;
    $ctrl.userId = $stateParams.userId;
    $ctrl.openCreatingModal = openCreatingModal;

    function openCreatingModal() {
        $uibModal.open({
            component: 'postModal'
        });
    }
}
