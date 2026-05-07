const router = require('express').Router();
const authRoute = require('./auth');
const profileRoute = require('./profile');
const tasksRoute = require('./tasks');

router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/tasks', tasksRoute);

module.exports = router;
