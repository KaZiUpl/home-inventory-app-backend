const express = require('express');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const housesController = require('../controllers/houses');

router.use(checkAuthMiddleware);

/**
 * @apiDefine House House
 * Endpoints for managing information about user's main containers.
 */

/**
 * @api {post} /houses Create new main container (house)
 * @apiName PostHouse
 * @apiGroup House
 * @apiPermission logged in user
 */
router.post('/', housesController.createHouse);

/**
 * @api {get} /houses Get list of user's main containers (houses).
 * @apiName GetHouseList
 * @apiGroup House
 * @apiPermission logged in user
 */
router.get('/', housesController.getHouseList);

/**
 * @api {get} /houses/:id Get main container (house) info.
 * @apiName GetHouseInfo
 * @apiGroup House
 * @apiPermission main container's owner or collaborators
 */
router.get('/:id', housesController.getHouse);

/**
 * @api {put} /houses/:id Modify main container (house) info.
 * @apiName PutHouseInfo
 * @apiGroup House
 * @apiPermission main container's owner
 */
router.put('/:id', housesController.editHouse);

/**
 * @api {delete} /houses/:id Delete main container (house) with it's content.
 * @apiName DeleteHouse
 * @apiGroup House
 * @apiPermission main container's owner
 */
router.delete('/:id', housesController.deleteHouse);

module.exports = router;
