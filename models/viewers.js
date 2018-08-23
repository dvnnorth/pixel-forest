// Viewers
module.exports = function (sequelize, DataTypes) {
    // Group table will hold the fk from the Users 
    const Viewers = sequelize.define('Viewers', {
        //firebase photo url id 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        //title of the post no longer than 100 characters
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });
    Viewers.associate = function (models) {
        //post must belong to a user
        Viewers.belongsTo(models.Users, {
            foreignKey: models.Users.id
        });
    };
    return Viewers;
}