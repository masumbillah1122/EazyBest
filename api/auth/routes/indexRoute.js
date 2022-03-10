const express = require('express');
const router = express.Router()
const { AdminRouter } = require('../routes/adminRoute')

const PermissionRouter = require('../middleware/permissionMiddleware');

router.use("/admin", PermissionRouter.Admin, AdminRouter);

module.exports = router;