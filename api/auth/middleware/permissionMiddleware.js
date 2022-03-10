const jwt = require('jsonwebtoken');
const Role = require('../../../models/RoleModel');
const { RouteGroupName } = require('../../helpers');

class PermissionMiddleware {
    async Admin(req, res, next) {
        try {
            const pathGroup = RouteGroupName(req.path)
            const token = await req.headers.authorization
            if (!token)
                return res.status(404).json({
                    message: 'Token not found'
                })

            //Decode token
            const splitToken = await req.headers.authorization.split(' ')[1]
            const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)

            // Match with roles
            const isRole = await Role.findOne({
                $or: [
                    { $and: [{ role: decode.role }, { rights: { $in: [pathGroup] } }] },
                    { $and: [{ role: decode.role }, { rights: { $in: ["all"] } }] }
                ]
            }).exec()

            if (!isRole)
                return res.status(501).json({
                    message: "You have no access."
                })

            req.user = decode
            next()
        } catch (error) {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(410).json({
                        message: 'Token expired'
                    })
                }
                return res.status(501).json({
                    message: 'unauthorized request'
                })
            }
        }
    }
}


module.exports = new PermissionMiddleware();