const uuidv1 = require('uuid/v1');

module.exports = function (sequelize, DataTypes) {
    const Session = sequelize.define('Session', {
        token: DataTypes.STRING
    });

    Session.associate = function (models) {
        Session.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    Session.prototype.setSession = function (userId) {
        return new Promise((resolve, reject) => {
            const session = new Session({
                token: uuidv1(),
                UserId: userId
            });

            session
                .save()
                .then(() => {
                    resolve(session.token);
                }, reject);
        });
    };

    Session.prototype.removeSession = function (token) {
        return new Promise((resolve, reject) => {
            Session
                .destroy({
                    where: {
                        token
                    }
                })
                .then(() => {
                    resolve();
                }, reject);
        });
    };

    return Session;
};
