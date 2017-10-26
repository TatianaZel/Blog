"use strict";

module.exports = function (sequelize) {

    var Membership = sequelize.define("Membership", {});

    Membership.prototype.check = function (uId, cId) {
        return new Promise((resolve, reject) => {
            return Membership.findOne({
                where: {
                    UserId: uId,
                    ChatId: cId
                }
            }).then((ms) => {
                if (ms) {
                    resolve();
                }
                reject('User does not participate in this chat');
            });
        });
    };

    return Membership;
};
