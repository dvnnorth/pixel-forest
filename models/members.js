module.exports = function(sequelize, DataTypes) {
    // Group table will hold the fk from the users 
    const Members = sequelize.define('members',{
        //whether a user is an owner of the membership or a viewers [0:Owner , 1: Viewer]
        memberType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len:[1]
            }
        }
    });

    Members.associate = function(models){
        //one membership belongs to a user
        Members.belongsTo(models.Groups, {
            foreignKey: models.Groups.id
        });
        //a membership has one group
        Members.hasOne(models.Users,{
          foreignKey: models.Users.id
    });
    
    return Members;
    };
};