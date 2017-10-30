"use strict";

module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
        text: {
            type: DataTypes.STRING,
            notEmpty: true
        }
    });

    Message.associate = function (models) {
        Message.belongsTo(models.Chat);
        Message.belongsTo(models.User, {as: 'author'});
    };

    Message.prototype.getMessagesByChat = function (id, userModel, from) {
        return new Promise((resolve) => {
            let opt = {
                where: {
                    ChatId: id
                },
                offset: from,
                limit: 100,
                include: [{model: userModel, as: 'author'}],
                order: [
                    ['createdAt']
                ]
            };

            Message.findAll(opt).then((messages) => {
                resolve(messages);
            });
        });
    };

    return Message;
};
