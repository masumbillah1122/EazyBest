const express = require('express');
const router = express.Router();

const UserController = require('../../auth/controller/user/UserController');

router.post('/admin', UserController.Login);

module.exports = router;