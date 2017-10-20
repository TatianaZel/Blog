"use strict";

const Session = require("../helpers/HttpError");


module.exports = function (sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {});

    Chat.associate = function (models) {
        Chat.hasMany(models.Message);
        Chat.belongsToMany(models.User, {through: models.Membership});
    };

    return Chat;
};
