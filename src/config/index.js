const dotenv = require('dotenv');

dotenv.config();

module.exports =  {
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
}