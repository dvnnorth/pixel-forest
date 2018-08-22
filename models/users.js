module.exports = function (sequelize, DataTypes) {
    //need to have user's name, emailAdd, and BOOLEAN owner
    const Users = sequelize.define('Users', {
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
        },
        //True if a user is an owner of a group else if invitee 'false' {can be updated to true once a user creates a group} and validate if the owner already has allotted one group
        groupOwner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
            }
        },
    }
    );
    Users.associate = function (models) {
        //A user can have many membership
        Users.hasMany(models.Members);
        //A user can have many membership
        Users.hasMany(models.Posts);
    };
    return Users;
};