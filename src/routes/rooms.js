const express = require('express');

const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const roomsController = require('../controllers/rooms');

//restrict all routes to logged in users
router.use(checkAuthMiddleware);

module.exports = router;
