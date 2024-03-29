const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: process.env.PORT || 8080,
    FRONT_PORT: process.env.FRONT_PORT || 8081,
    HOST: process.env.HOST || "localhost",

    DB_URL_LOCAL: process.env.DB_URL_LOCAL || 'mongodb://localhost/teamUp',
    DB_URL_CLUSTER_TESTING: process.env.DB_URL_CLUSTER_TESTING,
    DB_URL_CLUSTER: process.env.DB_URL_CLUSTER,

    SECRET_KEY: process.env.SECRET_KEY || "lu3028kb855gnzddr7vjlo0xgpkj2s4f",

    EMAIL_SERVICE: process.env.EMAIL_SERVICE || "",
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    
    API_VERSION: process.env.API_VERSION || "v1"
}