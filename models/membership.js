module.exports = function (sequelize, DataTypes) {
    const Membership = sequelize.define('Membership', {
        counter: DataTypes.INTEGER
    });

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

    Membership.prototype.setCounter = function (userId, chatId, increase) {
         return new Promise((resolve) => {
            Membership.update(
                        {
                            counter: increase ? sequelize.literal('counter + 1') : 0
                        },
                        {
                            where: {
                                UserId: userId,
                                ChatId: chatId
                            }
                        }
                    ).then(resolve);
        });
    };

    return Membership;
};
