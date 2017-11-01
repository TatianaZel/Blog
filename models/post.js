module.exports = function (sequelize, DataTypes) {
    const Post = sequelize.define('Post', {
        title: DataTypes.STRING,
        text: DataTypes.STRING
    });

    Post.associate = function (models) {
        Post.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Post;
};
