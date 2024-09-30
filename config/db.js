const models = require('../Models');

const connectDB = async () => {
    try {
        await models.sequelize.authenticate();
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB