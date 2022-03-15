const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Admin = require('../../../../models/AdminModel');
const Validator = require('../../validators/AuthorValidator');

class AuthorController {
    async Login(req, res, next) {
        try {
            const { email, password } = req.body

            // Validate check
            const validate = await Validator.Login(req.body)
            if (validate.isValid === false) {
                return res.status(422).json({
                    status: false,
                    message: validate.error
                })
            }

            // Account find using email
            const account = await Admin.findOne({ email: email })
                .populate("role")
                .exec()

            if (!account) {
                return res.status(404).json({
                    status: false,
                    message: 'Invalid e-mail or password'
                })
            }

            // Check blocked
            if (account.status === 'Deactive') {
                return res.status(422).json({
                    status: false,
                    message: 'Your account has been blocked from admin.'
                })
            }
            // Compare with password
            const result = await bcrypt.compare(password, account.password)
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: 'Invalid e-mail or password'
                })
            }
            // Generate JWT token
            const token = await jwt.sign({
                id: account._id,
                name: account.name,
                role: account.role.role,
                permisssions: account.role.rights
            }, process.env.JWT_SECRET, { expiresIn: '1d' })

            return res.status(200).json({
                status: true,
                token
            })
        } catch (error) {
            if (error) {
                console.log(error)
                next(error)
            }
        }
    }

    // Reset Password
    async Reset(req, res, next) {
        try {
            const { email } = req.body
            if (!email) {
                return res.status(422).json({
                    status: false,
                    email: "email address required."
                })
            }

            // find account
            const account = await Admin.findOne({ email: email }, { password: 0 }).exec()

            if (!account) {
                return res.status(404).json({
                    status: false,
                    message: "Account not found."
                })
            }

            // Generate unique password
            const uniquePassword = await UniqueCode()

            // Password Hash
            const hashPassword = await bcrypt.hash(uniquePassword, 10)

            // Mail transporter
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mas169572274@gmail.com',
                    password: '@allOk!'
                }
            })

            // send mail with defined transport object
            const mailService = await transporter.sendMail({
                from: '"EazyBest.com" <no-reply@eazybest.com>', // sender address
                to: email, //list of receivers
                subject: "Password Reset", //Subject line
                html: `<p>Hello ${account.name} your password have been changed, Your new password is <b>${uniquePassword}</b>. <br/>Don't share your password with anyone.</p>`, // html body
            })

            if (!mailService) {
                res.status(501).json({
                    status: false,
                    message: "Internal server error."
                })
            }

            // Update account
            const isUpdateAccount = await Admin.findOneAndUpdate({ email }, { $set: { password: hashPassword } }, { multi: false }).exec()

            if (!isUpdateAccount) {
                res.status(501).json({
                    status: false,
                    message: "Internal server error."
                })
            }

            res.status(201).json({
                status: true,
                message: "Check your e-mail a new password send to your email.",
            })
        } catch (error) {
            if (error) next(error)
        }
    }
}

module.exports = new AuthorController();