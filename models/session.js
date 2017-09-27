"use strict";
const uuidv1 = require('uuid/v1');

module.exports = function (sequelize, DataTypes) {
    var Session = sequelize.define("Session", {
        token: DataTypes.STRING
    });

    Session.associate = function (models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Session.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    Session.prototype.setSession = function (userId) {
        return new Promise((resolve, reject) => {
            let token = uuidv1();

            Session.create({
                token: token,
                UserId: userId
            }).then(() => {
                resolve(token);
            }, reject);

        });
    };

    Session.prototype.removeSession = function (token) {
        return new Promise((resolve, reject) => {
            Session.destroy({
                where: {
                    token: token
                }
            }).then(function () {
                resolve();
            }, reject);

            return;
        });
    };

    return Session;
};
