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
 * @apiParam {String} name Name of the main container (house)
 * @apiParam {String} description Description of the main container (house)
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      "message": "House created."
 * }
 */
router.post('/', housesController.createHouse);

/**
 * @api {post} /houses/:id/collaborators Add collaborator to a main container (house)
 * @apiName PostAddCollaborator
 * @apiGroup House
 * @apiPermission main container's owner
 * @apiParam {String} id main container's id
 * @apiParam {String} name Name or email of the collaborator
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      "message": "Collaborator added."
 * }
 */
router.post('/:id/collaborators', housesController.addCollaborator);

/**
 * @api {get} /houses/:id/collaborators Add collaborator to a main container (house)
 * @apiName GetCollaboratorList
 * @apiGroup House
 * @apiPermission main container's owner or collaborator
 * @apiParam {String} id main container's id
 * @apiSuccess (Success 200) {Object[]} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      
 * }
 */
router.get(':id/collaborators', housesController.getCollaborators);

/**
 * @api {get} /houses Get list of user's main containers (houses).
 * @apiName GetHouseList
 * @apiGroup House
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {Object[]} Array of user's main containers
 * @apiSuccessExample {json} Success-Response:
 * [
 *   {
 *      "collaborators": [],
 *      "_id": "5f3fc8decebf502870d04c84",
 *      "name": "house",
 *      "description": "some description",
 *      "__v": 0
 *  },
 *  {
 *      "collaborators": [],
 *      "_id": "5f42cf14c7367b3868a7355c",
 *     "name": "asd",
 *     "description": "some description",
 *     "__v": 0
 * }
 *]
 */
router.get('/', housesController.getHouseList);

/**
 * @api {get} /houses/:id Get main container (house) info.
 * @apiName GetHouseInfo
 * @apiGroup House
 * @apiPermission main container's owner or collaborators
 * @apiParam {String} id ID of the main container (house)
 * @apiSuccess (Success 200) {Object} Requested main container
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "collaborators": [],
 * "_id": "5f3fc8decebf502870d04c84",
 * "name": "house",
 * "description": "some description",
 * "owner": "5f2584b9bb2de6e74fd3b39e",
 * "__v": 0
 *}
 */
router.get('/:id', housesController.getHouse);

/**
 * @api {put} /houses/:id Modify main container (house) info.
 * @apiName PutHouseInfo
 * @apiGroup House
 * @apiPermission main container's owner
 * @apiParam {String} name New name of the main container (house)
 * @apiParam {String} description New description of the main container (house)
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample Success-Response:
 *     {
 *       "message": "House info updated."
 *     }
 */
router.put('/:id', housesController.editHouse);

/**
 * @api {delete} /houses/:id Delete main container (house) with it's content.
 * @apiName DeleteHouse
 * @apiGroup House
 * @apiPermission main container's owner
 * @apiParam {String} id Main container's id
 * @apiSuccess {String} message Response message
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "message": "House deleted."
 *     }
 */
router.delete('/:id', housesController.deleteHouse);

/**
 * @api {delete} /houses/:id/collaborators/:user_id Delete a collaborator from a main container (house)
 * @apiName DeleteCollaborator
 * @apiGroup House
 * @apiPermission main container's owner or collaborator
 * @apiDescription Deletes user with provided id from collaborators list. Can be used either by main container's owner or one of its collaborators.
 * @apiParam {String} id main container's id
 * @apiParam {String} user_id id of a user
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      
 * }
 */
router.delete(':id/collaborators', housesController.deleteCollaborator);

module.exports = router;
