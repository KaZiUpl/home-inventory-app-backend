const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const ItemsController = require('../controllers/items.controller');

router.post('/', ItemsController.createItem);

router.get('/:id', ItemsController.getItem);

router.get('/', ItemsController.getItems);

router.put('/:id', ItemsController.putItem);

router.delete('/:id', ItemsController.deleteItem);

module.exports = router;
