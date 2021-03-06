const uuid = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {
    //need to have user's name, emailAdd, and BOOLEAN owner
    const Users = sequelize.define('Users', {
        // userid as UUID
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: uuid()
        },
        //email address only
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        //First name no longer than 20
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        //Last name no londer than 20
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        }
    }
    );
    Users.associate = function (models) {
        Users.hasMany(models.Posts);
    };
    return Users;
};