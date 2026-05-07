const router = require('express').Router();
const controllers = require('./lib/controllers');
const isAuthenticated = require('../../middleware/auth.middleware');

router.use(isAuthenticated);

router.get('/', controllers.getProfile);
router.put('/update', controllers.updateProfile);
router.post('/change/password', controllers.changePassword);
router.post('/logout', controllers.logout);

module.exports = router;
