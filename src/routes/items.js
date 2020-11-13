const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const ItemsController = require('../controllers/items.controller');

router.get('/', ItemsController.test);

module.exports = router;
