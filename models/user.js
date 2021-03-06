const HttpError = require('../helpers/HttpError');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
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

    User.auth = function (email, password) {
        return new Promise((resolve, reject) => {
            User
                    .findOne({
                        where: {
                            email,
                            password
                        }
                    })
                    .then((user) => {
                        if (user) {
                            resolve(user);
                        }
                        reject(new HttpError(403, 'Wrong email or password'));
                    });
        });
    };

    User.checkEmail = function (email, id) {
        return new Promise((resolve, reject) =>
            User
                    .findOne({
                        where: {
                            email,
                            id: {
                                $not: id//this check is needed for the case when the user wants to edit the profile and tie a new email
                            }
                        }
                    })
                    .then((user) => {
                        if (user) {
                            reject(new HttpError(403, 'Email alredy exists'));
                        }
                        resolve();
                    })
        );
    };

    User.getChats = function (id, chatModel) {
        return new Promise((resolve) => {
            const opt = {
                where: {
                    id
                },
                include: [
                    {
                        model: chatModel,
                        include: [
                            {
                                model: User,
                                attributes: [
                                    'id',
                                    'name',
                                    'surname'
                                ]
                            }
                        ]
                    }
                ]
            };

            User.findOne(opt).then((user) => {
                resolve(user.Chats);
            });
        });
    };

    return User;
};
