//Groups
module.exports = function(sequelize, DataTypes) {
    // Group table will hold the fk from the Users 

    const Groups = sequelize.define('groups', {
      //name of the group no longer than 30 characters
          groupName: {
            type:DataTypes.STRING,
            allowNull: false,
            validate: {
              len:[30]
            }
          },
      //firebase cloudstorage url for group profile pic 
          groupPhoto: {
            type:DataTypes.TEXT,
            allowNull: true,
            validate: {
              isUrl: true
            }
          },
        }
    );
    Groups.associate = function(models){
      //Groups has at least one owner with ownersPk as Fk.
      Groups.hasMany(Members,{
        foreignKey: models.Members.id
      })
      //Groups has many posts
      Groups.hasMany(models.Posts, {
        onDelete: 'cascade'
      });
      //not sure if this applies because a group may not have any user but an owner. 
      // Groups.hasMany(models.Users);
    };
    return Groups;
};