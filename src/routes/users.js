const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/users.controller');
const checkAuthMiddleware = require('../middleware/checkAuth');

const router = express.Router();

/**
 * @api {post} /users Create new user
 * @apiName PostCreateUser
 * @apiGroup User
 * @apiParam {String} login Username (min length: 5, max length: 20, regexp: ^[a-zA-Z0-9]+$)
 * @apiParam {String} password User password (min length: 8, max length: 20, regexp: ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{1,}$)
 * @apiParam {String} email User email
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccess (Success 200) {String} id Created user id
 * @apiSuccessExample {json} Response(example):
{
    "message": "User created successfully",
    "id": "5ff3217ced3a2e44d4970bb6"
}
 */
router.post(
  '/',
  [
    body('login')
      .exists()
      .isLength({ min: 5 })
      .withMessage('must be at least 5 chars long')
      .isLength({ max: 20 })
      .withMessage('must be at most 20 chars long')
      .matches('^[a-zA-Z0-9]+$')
      .withMessage('can only have digits and lower and upper case characters'),
    body('email').exists(),
    body('password')
      .exists()
      .isLength({ min: 8 })
      .withMessage('must be at least 8 chars long')
      .isLength({ max: 20 })
      .withMessage('must be at most 20 chars long')
      .matches(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{1,}$'
      )
      .withMessage(
        'must have lower, upper case letter, a digit and special character'
      )
  ],
  userController.createUser
);

/**
 * @api {get} /users/:id Get user info
 * @apiName GetUserInfo
 * @apiGroup User
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} login User's login
 * @apiSuccess (Success 200) {String} email User's email
 * @apiSuccess (Success 200) {String} role User's role
 * @apiSuccessExample {json} Response(example):
{
    "login": "Test",
    "email": "test@example.com",
    "role": "user",
    "__v": 0
}
 */
router.get('/:id', checkAuthMiddleware, userController.getUser);

/**
 * @api {put} /users/:id Update user info
 * @apiName PutUserInfo
 * @apiGroup User
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "User modified"
}
 */
router.put(
  '/:id',
  checkAuthMiddleware,
  [body('login').exists()],
  userController.putUser
);

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
 * @apiSuccess (Success 200) {String} login User's login
 * @apiSuccess (Success 200) {String} id User's id
 * @apiSuccessExample {json} Response(example):
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjA5NzcwMzA3LCJpYXQiOjE2MDk3Njk0MDd9.v3hm8uHzp8BexJBuixJLV-8ADoyzXacH2FUzwCjxMWY",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjQxMzA1NDA3LCJpYXQiOjE2MDk3Njk0MDd9.NBgQ2eZT-SXl8CIXmYv-iqF1N-8Ks-6xjk2fbV4l-VQ",
    "expires": "2021-01-04T14:25:07.000Z",
    "id": "5ff3217ced3a2e44d4970bb6",
    "email": "test@example.com",
    "login": "Test",
    "role": "user"
}
 */
router.post(
  '/auth',
  [body('login').exists(), body('password').exists()],
  userController.login
);

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
 * @apiSuccess (Success 200) {String} login User's login
 * @apiSuccess (Success 200) {String} id User's id
 * @apiSuccessExample {json} Response(example):
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjA5NzcwNTMwLCJpYXQiOjE2MDk3Njk2MzB9.URROkh-tZ6Vx0dzpoYmmoIwDL0vxGm53gO29XaI46lM",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjQxMzA1NDA3LCJpYXQiOjE2MDk3Njk0MDd9.NBgQ2eZT-SXl8CIXmYv-iqF1N-8Ks-6xjk2fbV4l-VQ",
    "expires": "2021-01-04T14:28:50.000Z",
    "id": "5ff3217ced3a2e44d4970bb6",
    "email": "test@example.com",
    "login": "Test",
    "role": "user"
}
 */
router.post(
  '/auth/refresh',
  [body('token').exists()],
  userController.refreshToken
);

/**
 * @api {post} /users/logout Logout user
 * @apiName PostLogout
 * @apiGroup User
 * @apiParam {String} token User's refresh token
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "User logged out"
}
 */
router.post('/logout', [body('token').exists()], userController.logout);

module.exports = router;
