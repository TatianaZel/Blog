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

    Session.setSession = function (userId) {
        let session = {
            token: uuidv1(),
            UserId: userId
        };

        return new Promise((resolve, reject) => {
            Session
                    .create(session)
                    .then(() => {
                        resolve(session.token);
                    }, reject);
        });
    };

    Session.removeSession = function (token) {
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
