const uuid = require('uuid/v4');
const v4options = {
    random: [
      0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea,
      0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36
    ]
  };

module.exports = function (sequelize, DataTypes) {
    //need to have user's name, emailAdd, and BOOLEAN owner
    const Users = sequelize.define('Users', {
        // userid as UUID
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: uuid(v4options)
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