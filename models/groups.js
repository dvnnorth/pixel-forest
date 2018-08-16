//GROUPS
module.exports = function(sequelize, DataTypes) {
    // Group table will hold the fk from the users 

    const groups = sequelize.define('groups', {
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

    groups.associate = function(models){
      //groups has at least one owner with ownersPk as Fk.
      groups.hasOne(users,{
        foreignKey: {allowNull: false}
      })
      //groups has many posts
      groups.hasMany(models.posts, {
        onDelete: 'cascade'
      });
      //not sure if this applies because a group may not have any user but an owner. 
      // groups.hasMany(models.users);
    };

    return groups;
};