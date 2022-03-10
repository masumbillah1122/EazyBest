const express = require('express');
const router = express.Router();

const RoleController = require('../controller/role/RoleController');
const RoleRouteController = require('../controller/role/routeController');

// Role Routes
router.get('/role', RoleController.Index);
router.post('/role', RoleController.Store);
router.get('/role/:id', RoleController.Show);
router.put('/role/:id', RoleController.Update);
router.delete('/role/:id', RoleController.Delete);

// Routes Path
router.get('/role/route/paths', RoleRouteController.Index);


module.exports = router;