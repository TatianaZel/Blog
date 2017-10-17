app.component('editModal', {
    templateUrl: 'build/views/blog/post-list/post-modal.html',
    bindings: {
        close: '&'
    },
    controller: ['postListService', editModalController]
});

function editModalController(postListService) {
    const $ctrl = this;

    $ctrl.blogReqData = postListService.reqData;

    $ctrl.postData = {
        title: postListService.editedPost.title,
        text: postListService.editedPost.text
    };

    $ctrl.submitFunc = editPost;

    function editPost() {
        postListService.editPost(postListService.editedPost.id, $ctrl.postData).then(() => {
            postListService.editedPost.title = $ctrl.postData.title;
            postListService.editedPost.text = $ctrl.postData.text;
            $ctrl.close();
        }, $ctrl.close);
    }
}
