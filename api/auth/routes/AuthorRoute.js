const express = require('express');
const router = express.Router();

const AuthorController = require('../controller/author/AuthorController');

router.post('/admin', AuthorController.Login);

module.exports = router;