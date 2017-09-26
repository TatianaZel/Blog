"use strict";

const HttpError = require("../helpers/HttpError");
const uuidv1 = require('uuid/v1');

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
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        session: {
            type: DataTypes.UUID
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Post);
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

    User.prototype.setSession = function () {
        return new Promise((resolve, reject) => {
            if (!this.session) {
                this.session = uuidv1();

                this
                        .save()
                        .then(() => {
                            resolve(this.session);
                        },
                                reject
                                );
            } else {
                resolve(this.session);
            }
        });
    };

    User.prototype.removeSession = function () {
        return new Promise((resolve, reject) => {
            console.log('sfssdsdssdfsdsfdsdfsdsdfs');
            this.session = null;

            this
                    .save()
                    .then(() => {
                        resolve();
                    },
                            reject
                            );

            return;
        });
    };

    return User;
};
