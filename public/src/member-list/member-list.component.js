app.component('memberList', {
    templateUrl: 'build/views/member-list/member-list.html',
    controller: ['memberListService', memberListController],
});

function memberListController(memberListService) {
    const $ctrl = this;

    $ctrl.members = memberListService.members;

    memberListService.getMembers();
}
