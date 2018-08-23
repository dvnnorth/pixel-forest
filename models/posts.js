//Posts
module.exports = function (sequelize, DataTypes) {
    // Group table will hold the fk from the Users 
    const Posts = sequelize.define('Posts', {
        //firebase photo url id 
        pictureUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isUrl: true,
            }
        },
        //title of the post no longer than 100 characters
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        //body of the post no longer than 500 characters
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1, 500]
            }
        },
    });
    Posts.associate = function (models) {
        //post must belong to a user
        Posts.belongsTo(models.Users, {
            foreignKey: models.Users.id
        });
    };
    return Posts;
}