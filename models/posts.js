//POSTS
module.exports = function(sequelize, DataTypes) {
    // Group table will hold the fk from the users 
    const posts = sequelize.define('posts', {
      //not sure urlId
        urlId: {
            type:DataTypes.TEXT,
            allowNull: true,
            validate: {
              isUrl: true,
            }
          },
      //title of the post no longer than 100 characters
          title: {
            type:DataTypes.STRING,
            allowNull: false,
            validate: {
              len:[1,100]
            }
          },
      //body of the post no longer than 500 characters
          body: {
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
              len:[1,500]
            }
          },
        },

        posts.associate = function(models){
          //post must belong to a user
          posts.belongsTo(models.users,{ 
            //post's tables fk is posting user's pk
            foreignKey: {allowNull: false}
          })
          posts.hasOne(models.groups,{ 
            //post's tables fk is posting user's pk
            foreignKey: {allowNull: false}
          })
        }
    );
    return posts;
}