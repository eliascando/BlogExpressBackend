const { config } = require('dotenv');
config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL || ''
}

module.exports = {
    env
}