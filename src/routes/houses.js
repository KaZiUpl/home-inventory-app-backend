const express = require('express');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const housesController = require('../controllers/houses');

router.use(checkAuthMiddleware);

router.post('/', housesController.createHouse);

router.get('/', housesController.getHouseList);

router.get('/:id', housesController.getHouse);

router.put('/:id', housesController.editHouse);

router.delete('/:id', housesController.deleteHouse);

module.exports = router;
