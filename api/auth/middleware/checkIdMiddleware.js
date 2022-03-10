const mongoose = require('mongoose')

// Check validate mongoose ID
class CheckIdMiddleware {
    async isMongooseId(id) {
        if (!mongoose.isValidObjectId(id)) {
            let error = new Error()
            error.status = 400
            throw error
        }
    }
}

module.exports = new CheckIdMiddleware();