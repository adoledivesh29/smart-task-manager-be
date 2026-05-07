const router = require('express').Router();
const controllers = require('./lib/controllers');
const isAuthenticated = require('../../middleware/auth.middleware');

router.post('/', isAuthenticated, controllers.createTask);
router.get('/', isAuthenticated, controllers.getTasks);
router.get('/metadata', isAuthenticated, controllers.getTaskMetadata);
router.post('/:id/toggle', isAuthenticated, controllers.toggleComplete);
router.delete('/:id', isAuthenticated, controllers.deleteTask);
module.exports = router;
