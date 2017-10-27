"use strict";

const Session = require("../helpers/HttpError");


module.exports = function (sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {});

    Chat.associate = function (models) {
        Chat.hasMany(models.Message);
        Chat.belongsToMany(models.User, {through: models.Membership});
    };

    Chat.prototype.getChatUsers = function (id, userModel) {
        return new Promise((resolve) => {
            let opt = {
                where: {
                    id: id
                },
                include: [userModel]
            };

            Chat.findOne(opt).then((chat) => {
                resolve(chat.Users);
            });
        });
    };

    Chat.prototype.getChat = function (id, userModel, messageModel) {
        return new Promise((resolve) => {
            let opt = {
                where: {
                    id: id
                },
                include: [
                    {
                        model: userModel,
                        attributes: ['id', 'name', 'surname']
                    },
                    {
                        model: messageModel,
                        include: [
                            {
                                model: userModel,
                                as: 'author'
                            }
                        ]
                    }
                ]
            };

            Chat.findOne(opt).then((chat) => {
                resolve(chat);
            });
        });
    };

    return Chat;
};
