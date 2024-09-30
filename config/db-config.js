require("dotenv").config();
module.exports = {
    dbConfigs: {
        "development": {
            "username": process.env.DB_USER,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_NAME,
            "host": process.env.DB_HOST,
            "dialect": process.env.DB_DIALECT,
            "port": process.env.DB_PORT,
            "use_env_variable": false,
            "dialectOptions": {
                ssl: {
                  require: true, // This will enforce SSL connection
                  rejectUnauthorized: false // For self-signed certificates
                }
            },
            "timezone": '+05:30'
        },"staging": {
            "username": process.env.DB_USER,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_NAME,
            "host": process.env.DB_HOST,
            "dialect": process.env.DB_DIALECT,
            "port": process.env.DB_PORT,
            "use_env_variable": false,
            "dialectOptions": {
                useUTC: false, // for reading from database,
                "timezone": "Asia/Calcutta"
            },
            "timezone": '+05:30'
        },"prod": {
            "username": process.env.DB_USER,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_NAME,
            "host": process.env.DB_HOST,
            "dialect": process.env.DB_DIALECT,
            "port": process.env.DB_PORT,
            "use_env_variable": false,
            "dialectOptions": {
                useUTC: false, // for reading from database
                "timezone": "Asia/Calcutta"
            },
            "timezone": '+05:30'
        },
    }
}