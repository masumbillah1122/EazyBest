const bcrypt = require('bcryptjs');
const Admin = require('../../../../models/AdminModel');
// const AdminValidators = require('../../validators/AdminValidator');
// const CheckIdMiddleware = require('../../middleware/checkIdMiddleware');
// const PaginateHelpers = require('../../../helpers/paginateHelpers');
const Validator = require('../../validators/AdminValidator');
const { HostURL, UploadFile } = require('../../../helpers/index');
const { PaginateQueryParams, Paginate } = require('../../../helpers/paginateHelpers');
const { isMongooseId } = require('../../middleware/checkIdMiddleware');
const { populate } = require('../../../../models/AdminModel');



class AdminController {
    async Index(req, res, next) {
        try {
            const items = []
            const { query } = req.query
            const { limit, page } = PaginateQueryParams(req.query)

            const totalItems = await Admin.countDocuments({ _id: { $ne: req.user.id } })
                .exec()
            const results = await Admin.find({
                    _id: { $ne: req.user.id }
                }, {
                    name: 1,
                    phone: 1,
                    role: 1,
                    status: 1,
                    isOnline: 1,
                    image: 1
                })
                .populate("role", "role")
                .exec()

            if (results && results.length) {
                for (let i = 0; i < results.length; i++) {
                    const element = results[i]

                    if (element.role) {
                        items.push({
                            _id: element._id,
                            name: element.name,
                            phone: element.phone,
                            role: element.role ? element.role.role : null,
                            status: element.status,
                            isOnline: element.isOnline,
                            image: HostURL(req) + "üploads/admin/" + element.image
                        })
                    }
                }
            }
            res.status(200)
                .json({
                    status: true,
                    data: items,
                    pagination: Paginate({ page, limit, totalItems })
                })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Store Item
    async Store(req, res, next) {
        try {
            const image = req.files
            const { name, email, phone, present_address, permanent_address, role, password } = req.body

            // Check mongoose ID
            await isMongooseId(role)

            // Validate Check
            const validate = await Validator.Store({...req.body, image })
            if (!validate.isValid) {
                return res.status(422).json({
                    status: false,
                    message: validate.error
                })
            }

            // Check email already exist or not
            const existEmail = await Admin.findOne({ email: email })
            if (existEmail) {
                return res.status(422).json({
                    status: false,
                    message: "Email already used."
                })

                // Upload File
                const uploadFile = await UploadFile(image.image, './uploads/admin/')
                if (uploadFile) {
                    return res.status(501).json({
                        status: false,
                        message: "Failed to upload image"
                    })
                }

                // Hash Password
                const hashPassword = await bcrypt.hash(password, 10)
                const newAdmin = new Admin({
                    name,
                    email,
                    phone,
                    address: { present_address, permanent_address },
                    role: role,
                    image: uploadFile,
                    password: hashPassword
                })

                const saveAdmin = await newAdmin.save()
                if (!saveAdmin) {
                    return res.status(501).json({
                        status: false,
                        message: "Failed to create admin."
                    })
                    res.status(201).json({
                        status: true,
                        message: "Successfully admin created."
                    })
                }
            }

        } catch (error) {
            if (error) next(error)
        }
    }

    // Show Specific Item

    async Show(req, res, next) {
        try {
            const { id } = req.params
            await isMongooseId(id)

            let result = await Admin.findById(id, {
                password: 0,
                status: 0,
                createdAt: 0,
                updatedAt: 0
            })
            populate("role", "role")
                .exec()
            if (result && result.image) result.image = HostURL(req) + "uploads/admin/" + result.image

            res.status(200).json({
                status: true,
                data: result
            })
        } catch (error) {
            if (error) next(error)
        }
    }
}

module.exports = new AdminController();