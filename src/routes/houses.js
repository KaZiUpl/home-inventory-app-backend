const express = require('express');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const housesController = require('../controllers/houses');

module.exports = router;