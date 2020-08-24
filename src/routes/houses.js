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
 * @apiDescription Adds a user as a collaborator. First user with login of email matching the provided name is added.
 * @apiParam {String} id main container's id
 * @apiParam {String} name login or email of the collaborator
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      "message": "Collaborator added."
 * }
 */
router.post('/:id/collaborators', housesController.addCollaborator);

/**
 * @api {get} /houses/:id/collaborators Get the list of collaborators
 * @apiName GetCollaboratorList
 * @apiGroup House
 * @apiPermission main container's owner or collaborator
 * @apiParam {String} id main container's id
 * @apiSuccess (Success 200) {Object[]} users Array of collaborators
 * @apiSuccess (Success 200) {String} _id Collaborator's id
 * @apiSuccess (Success 200) {String} login Collaborator's login
 * @apiSuccessExample {json} Response(example):
 *[
 *   {
 *       "_id": "5f327188295d5f121464d782",
 *       "login": "kacperkaz"
 *   }
 *]
 */
router.get('/:id/collaborators', housesController.getCollaborators);

/**
 * @api {get} /houses Get list of user's main containers (houses).
 * @apiName GetHouseList
 * @apiGroup House
 * @apiPermission logged in user
 * @apiDescription Returns a list of houses that user owns of is a collaborator in
 * @apiSuccess (Success 200) {Object[]} houses Array of user's main containers
 * @apiSuccess (Success 200) {String[]} collaborators Array of collaborator's id's
 * @apiSuccess (Success 200) {String} _id Main container's id
 * @apiSuccess (Success 200) {String} name Name of the main container
 * @apiSuccess (Success 200) {String} description Description of the main container
 * @apiSuccess (Success 200) {Object} owner Object with owner's id and login
 * @apiSuccessExample {json} Success-Response:
 *[
 *  {
 *      "collaborators": [
 *          "5f327188295d5f121464d782"
 *     ],
 *     "_id": "5f438a3f1b69ff37807e2a0c",
 *    "name": "asd",
 *    "description": "some description",
 *    "owner": {
 *        "_id": "5f2584b9bb2de6e74fd3b39e",
 *        "login": "admin"
 *    },
 *   "__v": 3
 *}
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
 * @apiSuccess (Success 200) {Object[]} collaborators Array of collaborators' logins and ids
 * @apiSuccess (Success 200) {String} _id Main container's id
 * @apiSuccess (Success 200) {String} name Name of the main container
 * @apiSuccess (Success 200) {String} description Description of the main container
 * @apiSuccess (Success 200) {Object} owner Object with owner's id and login
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "collaborators": [
 *      {
 *          "_id": "5f327188295d5f121464d782",
 *          "login": "kacperkaz"
 *      }
 *  ],
 *  "_id": "5f438a3f1b69ff37807e2a0c",
 *  "name": "asd",
 *  "description": "some description",
 *  "owner": {
 *      "_id": "5f2584b9bb2de6e74fd3b39e",
 *        "login": "admin"
 *   },
 *   "__v": 3
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
 * @api {delete} /houses/:id/collaborators Delete a collaborator from a main container (house)
 * @apiName DeleteCollaborator
 * @apiGroup House
 * @apiPermission main container's owner or collaborator
 * @apiDescription Deletes user with provided id from collaborators list. Can be used either by main container's owner or one of its collaborators in order to remove oneself from collaborating.
 * @apiParam {String} id main container's id
 * @apiParam {String} id collaborator's id
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *      "message": "Collaborator deleted."
 * }
 */
router.delete('/:id/collaborators', housesController.deleteCollaborator);

module.exports = router;
