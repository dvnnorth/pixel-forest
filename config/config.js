require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'pixelForestDB',
        host: 'localhost',
        dialect: 'mysql'
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'pixelForestTestDB',
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    },
    production: {
        use_env_variable: 'JAWSDB_URL',
        dialect: 'mysql'
    }
};