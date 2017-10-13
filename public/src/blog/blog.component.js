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
