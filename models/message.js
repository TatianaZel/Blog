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

    return Message;
};
