const express = require('express');

const userController = require('../controllers/users');
const checkAuthMiddleware = require('../middleware/checkAuth');

const router = express.Router();

/**
 * @api {post} /users Create new user
 * @apiName PostCreateUser
 * @apiGroup User
 * @apiParam {String} login Username
 * @apiParam {String} password User password
 * @apiParam {String} email User email
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "message": "User created."
 *     }
 */
router.post('/', async (req, res, next) => {
  try {
    let response = await userController.createNewUser(req);

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /users/:id Get user info
 * @apiName GetUserInfo
 * @apiGroup User
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} login User's login
 * @apiSuccess (Success 200) {String} email User's email
 * @apiSuccess (Success 200) {String} role User's role
 * @apiSuccessExample {json} Response(example):
 * {
 *     "login": "user",
 *     "email": "john_doe@gmail.com",
 *     "role": "user",
 * }
 */
router.get('/:id', checkAuthMiddleware, async (req, res, next) => {
  try {
    let result = await userController.getUser(req);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {put} /users/:id/login Change user's login
 * @apiName PutChangeLogin
 * @apiGroup User
 * @apiParam {String} login New login
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "message": "Login changed."
 *     }
 */
router.put('/:id/login', checkAuthMiddleware, userController.changeLogin);

/**
 * @api {put} /users/:id Update user info
 * @apiName PutUserInfo
 * @apiGroup User
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "message": "User modified."
 *     }
 */
router.put('/:id', checkAuthMiddleware, async (req, res, next) => {
  try {
    let result = userController.modifyUser(req);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {post} /users/auth Login user
 * @apiName PostLogin
 * @apiGroup User
 * @apiParam {String} login Username
 * @apiParam {String} password User password
 * @apiSuccess (Success 200) {String} token Access token
 * @apiSuccess (Success 200) {String} refresh_token Refresh token
 * @apiSuccess (Success 200) {String} expires Expiry date of access token
 * @apiSuccess (Success 200) {String} email User's email address
 * @apiSuccess (Success 200) {String} role User's role
 * @apiSuccess (Success 200) {String} id User's id
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *       "expires": "2020-08-03T11:11:13.000Z",
 *       "id": "5f2584b9bb2de6e74fd3b39e",
 *       "email": "john_doe@gmail.com",
 *       "role": "user"
 *     }
 */
router.post('/auth', async (req, res, next) => {
  try {
    let result = await userController.login(req);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {post} /users/auth/refresh Refresh access token
 * @apiName PostRefreshToken
 * @apiGroup User
 * @apiParam {String} token User's refresh token
 * @apiSuccess (Success 200) {String} token New access token
 * @apiSuccess (Success 200) {String} refresh_token Refresh token
 * @apiSuccess (Success 200) {String} expires Expiry date of access token
 * @apiSuccess (Success 200) {String} email User's email address
 * @apiSuccess (Success 200) {String} role User's role
 * @apiSuccess (Success 200) {String} id User's id
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *       "expires": "2020-08-03T11:11:13.000Z",
 *       "id": "5f2584b9bb2de6e74fd3b39e",
 *       "email": "john_doe@gmail.com",
 *       "role": "user"
 *     }
 */
router.post('/auth/refresh', async (req, res, next) => {
  try {
    let result = await userController.refreshToken(req);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {post} /users/logout Logout user
 * @apiName PostLogout
 * @apiGroup User
 * @apiParam {String} token User's refresh token
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "message": "User logged out."
 *     }
 */
router.post('/logout', async (req, res, next) => {
  try {
    let result = await userController.logout(req);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
