const express = require('express');
const Adminrouter = express.Router();

const AdminController = require('../controller/admin/AdminController')


// Admin routes
Adminrouter.get('/admin', AdminController.Index);
Adminrouter.post("/admin", AdminController.Store);
Adminrouter.get("/admin/:id", AdminController.Show);




module.exports = Adminrouter;