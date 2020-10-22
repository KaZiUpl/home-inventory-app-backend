const express = require('express');

const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const roomsController = require('../controllers/rooms.controller');

//restrict all routes to logged in users
router.use(checkAuthMiddleware);

/**
 * @apiDefine Room Room
 * Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.
 */

/**
 * @api {get} /rooms/:id Get room info
 * @apiName GetRoom
 * @apiGroup Room
 * @apiPermission house owner
 * @apiParam {String} id Room id
 */
router.get('/:id', roomsController.getRoom);

/**
 * @api {put} /rooms/:id Modify a room
 * @apiName PutRoom
 * @apiGroup Room
 * @apiDescription Modifies room's name and description
 * @apiPermission house owner
 * @apiParam {String} id Room id
 * @apiParam {String} name Room's name
 * @apiParam {String} description Room's description
 */
router.put('/:id', roomsController.modifyRoom);

/**
 * @api {delete} /rooms/:id Delete a room
 * @apiName DeleteRoom
 * @apiGroup Room
 * @apiDescription Deletes a room with provided id
 * @apiPermission house owner
 * @apiParam {String} id Room id
 */
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;
