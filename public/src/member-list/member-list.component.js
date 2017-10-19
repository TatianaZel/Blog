app.component('memberList', {
    templateUrl: 'build/views/member-list/member-list.html',
    controller: ['memberListService', 'socketService', memberListController],
    bindings: {
        authData: '<'
    }
});

function memberListController(memberListService, socketService) {
    memberListService.getMembers();

    const $ctrl = this;

    $ctrl.members = memberListService.members;
    //$ctrl.authData = authService.authData;

    $ctrl.filterParams = {
        searchOptions: ['name', 'surname']
    };

    $ctrl.sendMesasage = socketService.sendMessage;

//    $ctrl.orderOptions = [
//        {
//            nameOption: '-createdAt',
//            textOption: 'new first'
//        },
//        {
//            nameOption: 'createdAt',
//            textOption: 'new last'
//        },
//        {
//            nameOption: 'name',
//            textOption: 'order by name'
//        },
//        {
//            nameOption: 'surname',
//            textOption: 'order by surname'
//        },
//        {
//            nameOption: '-name',
//            textOption: 'not order by name'
//        },
//        {
//            nameOption: '-surname',
//            textOption: 'not order by surname'
//        }
//    ];
//
//    $ctrl.orderOptionIdx = '0';
}
