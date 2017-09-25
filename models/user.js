"use strict";

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
            type: sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        session: {
            type: sequelize.UUID
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Post);
    };

    User.prototype.auth = function (email, password) {
        return new Promise((resolve, reject) => {

            this.findOne({
                where: {
                    email: email,
                    password: password
                }
            }).then((user) => {
                if (user) {
                    resolve(user._id);
                }
                reject(new HttpError(403, "Wrong email or password"));
            });

        });
    };

    User.prototype.setSession = function (userId) {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: {
                    _id: userId
                }
            }).then(() => {
                
            });
        });
    };

    return User;
};
