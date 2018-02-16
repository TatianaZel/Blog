module.exports = function (sequelize, DataTypes) {
    const MessageCounter = sequelize.define('MessageCounter', {
        count: {
            type: DataTypes.INTEGER
        }
    });

    MessageCounter.associate = function (models) {//узнать как сделать айдишник составным внешним ключом
        MessageCounter.belongsTo(models.Chat);
        MessageCounter.belongsTo(models.User);
    };

    //увеличиваем счетчик
    MessageCounter.prototype.updateCounters = function(chatId, userId, count) {
        return new Promise((resolve) => {            
            MessageCounter.update(
                    {
                        where: {
                            ChatId: chatId,
                            UserId: userId
                        }
                    },
                    {
                        count: count
                    }
            ).then(resolve);            
        });
    };
    
    MessageCounter.prototype.newCounters = function(chatId, user1Id, user2Id) {
        return new Promise((resolve) => {
            let confArray = [
                {
                    UserId: user1Id,
                    ChatId: chatId,
                    count: 0
                },
                {
                    UserId: user2Id,
                    ChatId: chatId,
                    count: 0
                }
            ];

            MessageCounter.bulkCreate(confArray).then(resolve);

        });
    };

    return MessageCounter;
};
