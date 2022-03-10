const Role = require('../../../../models/RoleModel');
const Validator = require('../../validators/RoleValidator');
const { isMongooseId } = require('../../middleware/checkIdMiddleware');



class RoleController {

    // List of Items
    async Index(req, res, next) {
        try {
            let items

            const results = await Role.find({}, { role: 1, rights: 1 })
                .sort({ role: 1 })
                .exec()

            res.status(200).json({
                status: true,
                data: results
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Store new Item
    async Store(req, res, next) {
        try {
            const { role, rights } = req.body

            // validate check
            const validate = await Validator.Store(req.body)
            if (!validate.isValid) {
                return res.status(422).json({
                    status: false,
                    message: validate.error
                })
            }

            // Check exist
            const isExist = await Role.findOne({ role: role }).exec()
            if (isExist) {
                return res.status(409).json({
                    status: false,
                    message: `${role} already created!`
                })
            }

            const newRole = new Role({
                role,
                rights
            })

            // Save role
            const saveRole = await newRole.save()
            if (!saveRole) {
                return res.status(501).json({
                    status: false,
                    message: "Failed to create role!"
                })
            }

            res.status(201).json({
                status: true,
                message: `Successfully ${role} created`
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Show Specific Item
    async Show(req, res, next) {
        try {
            const { id } = req.params
            await isMongooseId(id)

            const result = await Role.findById(id, { role: 1, rights: 1 }).exec()

            res.status(200).json({
                status: true,
                data: result
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Update Specific Item
    async Update(req, res, next) {
        try {
            const { id } = req.params
            const { role, rights } = req.body
            await isMongooseId(id)

            // validate check
            const validate = await Validator.Store(req.body)
            if (!validate.isValid) {
                return res.status(422).json({
                    status: false,
                    message: validate.error
                })
            }

            // check available with id
            const available = await Role.findById(id).exec()
            if (!available) {
                return res.status(404).json({
                    status: false,
                    message: "Role not found !"
                })
            }

            // Check available with name
            const nameAvailable = await Role.find({ $and: [{ _id: { $ne: id } }, { role: role }] }).exec()
            if (nameAvailable.length) {
                return res.status(409).json({
                    status: false,
                    message: "Another role already available!"
                })
            }

            // Update available role
            const updateRole = await Role.findByIdAndUpdate(id, { $set: { role, rights } }).exec()
            if (!updateRole) {
                return res.status(501).json({
                    status: false,
                    message: "Failed to update role!"
                })
            }

            res.status(201).json({
                status: true,
                message: "Successfully role updated."
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Delete Specific Item
    async Delete(req, res, next) {
        try {
            const { id } = req.params
            await isMongooseId(id)

            // delete item
            const isDelete = await Role.findByIdAndDelete(id).exec()
            if (!isDelete) {
                return res.status(501).json({
                    status: false,
                    message: "Failed to delete !"
                })
            }

            res.status(200).json({
                status: true,
                message: "Successfully role deleted."
            })
        } catch (error) {
            if (error) next(error)
        }
    }
}

module.exports = new RoleController();