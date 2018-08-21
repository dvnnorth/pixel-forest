var db = require("../models");

module.exports = function(app) {
  // Get all Users with their Membership
  app.get("/api/Users", function(req, res) {
    db.Users.findAll({
      include: [db.Members,db.Posts]
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Get a specific Users with Membership info
  app.get("/api/Users/:id", function(req, res) {
    db.Users.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Members,db.Posts]
    }).then(function(dbUser) {
      res.json(dbUser);
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