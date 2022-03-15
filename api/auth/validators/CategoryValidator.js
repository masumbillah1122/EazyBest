const { isEmpty } = require("./helperValidator")

class CategoryValidator {
    async Store(data) {
        let error = {}

        if (!data.title || isEmpty(data.title)) error.title = "Title is required"
        if (!data.description || isEmpty(data.description)) error.description = "Description is required"

        if (!data.files) {
            error.image = "Image is required"
            error.banner = "Banner image is required"
        }

        if (data.files) {
            if (!data.files.image || isEmpty(data.files.image)) error.image = "Title image is required"
            if (!data.files.banner || isEmpty(data.files.banner)) error.banner = "Main image is required"
        }

        return {
            error,
            isValid: Object.keys(error).length === 0
        }
    }
}

module.exports = new CategoryValidator();