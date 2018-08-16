module.exports = function(sequelize, DataTypes) {
    // Group table will hold the fk from the users 
    const members = sequelize.define('members');

    members.associate = function(models){
        //one ownership entity is associated with one user
        members.hasMany(models.users,{
          foreignKey: {allowNull: false}
    });
        members.hasMany(models.groups,{
          foreignKey: {allowNull: false}
    });
    
    return members;
    };
};