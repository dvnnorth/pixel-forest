var db = require("../models");

module.exports = function(app) {
  // Get all posts associated with a group
  app.get("/api/posts/:groupId", function(req, res) {
    db.Posts.findAll({
        where: req.params.groupId,
        include: [db.Members,db.Groups]
    }).then(function(dbPosts) {
      res.json(dbPosts);
    });
  });

  // Create a new User
  app.post("/api/users", function(req, res) {
    db.Users.create(req.body, {
      include: [db.Members,db.Posts]
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Updata a specific user
  app.post("/api/users/:id", function(req, res) {
    db.Users.create(req.body, {
      where: {
        id: req.params.id
      },
      include: [db.Members,db.Posts]
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Delete an Users by id
  app.delete("/api/users/:id", function(req, res) {
    db.Users.destroy({ 
      where: { id: req.params.id },
      include: [db.Members,db.Posts]
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });
};