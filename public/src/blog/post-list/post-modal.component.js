app.component('postModal', {
    templateUrl: 'build/views/blog/post-list/post-modal.html',
    bindings: {
        close: '&'
    },
    controller: ['postListService', postModalController]
});

function postModalController(postListService) {
    const $ctrl = this;

    $ctrl.blogReqData = postListService.reqData;

    $ctrl.submitFunc = () => {
        postListService.createPost($ctrl.postData).then($ctrl.close);
    };
}
