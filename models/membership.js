module.exports = function (sequelize) {
    const Membership = sequelize.define('Membership', {});

    /*
     * Checking of participation in the chat
     */
    Membership.prototype.check = function (uId, cId) {
        return new Promise((resolve, reject) => {
            Membership
                .findOne({
                    where: {
                        UserId: uId,
                        ChatId: cId
                    }
                })
                .then((ms) => {
                    if (ms) {
                        resolve();
                    }
                    reject('User does not participate in this chat');
                });
        });
    };

    /*
     * Checking of existing chat between users
     */
    Membership.prototype.checkDialog = function (user1, user2) {
        return new Promise((resolve, reject) => {
            Membership
                .findAll({
                    where: {
                        UserId: user1
                    },
                    attributes: ['ChatId']
                })
                .then((memberChats) => {
                    var chats = [];

                    memberChats.forEach((item) => {
                        chats.push(item.ChatId);
                    });

                    Membership
                        .findOne({
                            where: {
                                UserId: user2,
                                ChatId: {
                                    $in: chats
                                }
                            }
                        })
                        .then((result) => {
                            if(!result)
                                resolve();
                            else
                                reject();
                        });
                });
        });
    };

    return Membership;
};
