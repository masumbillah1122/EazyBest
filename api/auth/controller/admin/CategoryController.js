const Category = require('../../../../models/CategoryModel');
const Validator = require('../../validators/CategoryValidator');
const { RedisClient } = require('../../../cache');
const { isMongooseId } = require('../../middleware/checkIdMiddleware');
const { HostURL, UploadFile, DeleteFile, CustomSlug } = require('../../../helpers/index');
const { Paginate, PaginateQueryParams } = require('../../../helpers/paginateHelpers')


class CategoryController {
    async Index(req, res, next) {
        try {
            const items = []
            const { limit, page } = PaginateQueryParams(req.query)

            const totalItems = await Category.countDocuments().exec()
            const results = await Category.find({}, { slug: 0, created_by: 0 })
                .sort({ _id: -1 })
                .skip((parseInt(page) * parseInt(limit)) - parseInt(limit))
                .limit(parseInt(limit))
                .exec()

            if (results && results.length) {
                for (let i = 0; i < results.length; i++) {
                    const element = results[i]
                    if (element) {
                        items.push({
                            _id: element._id,
                            title: element.title,
                            description: element.description,
                            isActive: element.isActive,
                            // is_deleteable: element.sub_categories.length || element.leaf_categories.length ? false : true,
                            image: HostURL(req) + "uploads/category/images/" + element.image,
                            banner: HostURL(req) + "uploads/category/banners/" + element.banner
                        })
                    }
                }
            }

            res.status(200).json({
                status: true,
                data: items,
                pagination: Paginate({ page, limit, totalItems })
            })
        } catch (error) {
            if (error) next(error)
        }
    }
}


module.exports = new CategoryController();