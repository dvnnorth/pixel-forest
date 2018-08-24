var db = require('./models');

db.Groups.create(
    {
        members: 30,
        groupName: 'Class Group'
    },
    {
        include: [
            db.Members,
            db.Posts
        ]
    }
);

db.Members.create(
    {
        memberType: 1,
        UserID: 30
    },
    {
        include: [
            db.Users,
            db.Groups
        ]
    }
);