module.exports = {
    port: process.env.port || process.env.PORT || 3000,
    db: process.env.mongoDb,
    dbUsername: process.env.mongoDbUsername,
    dbPassword: process.env.mongoDbPassword
};
