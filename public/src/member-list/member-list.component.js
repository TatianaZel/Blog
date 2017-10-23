app.component('memberList', {
    templateUrl: 'build/views/member-list/member-list.html',
    controller: ['memberListService', memberListController],
    bindings: {
        authData: '<'
    }
});

function memberListController(memberListService) {
    memberListService.getMembers();

    const $ctrl = this;

    $ctrl.members = memberListService.members;

    $ctrl.filterParams = {
        searchOptions: ['name', 'surname']
    };

}
