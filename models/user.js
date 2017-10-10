"use strict";

const HttpError = require("../helpers/HttpError");

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        surname: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        email: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        password: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        description: {
            type: DataTypes.STRING
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Post);
        User.hasMany(models.Session);
        User.belongsToMany(models.Chat, {through: models.Membership});
    };

    User.prototype.auth = function (email, password) {
        return new Promise((resolve, reject) => {
            User.findOne({
                where: {
                    email: email,
                    password: password
                }
            }).then((user) => {
                if (user) {
                    resolve(user.id);
                }
                reject(new HttpError(403, "Wrong email or password"));
            });
        });
    };

    return User;
};
