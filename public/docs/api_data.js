define({ "api": [
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get user info",
    "name": "GetUserInfo",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>User login</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"login\": \"john_doe\",\n  \"email\": \"john@doe.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create new user",
    "name": "PostCreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"msg\": \"User created.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/auth",
    "title": "Login user",
    "name": "PostLogin",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>Refresh token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n  \"refresh_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/logout",
    "title": "Logout user",
    "name": "PostLogout",
    "group": "User",
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/auth/refresh",
    "title": "Refresh access token",
    "name": "PostRefreshToken",
    "group": "User",
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Update user info",
    "name": "PutUserInfo",
    "group": "User",
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  }
] });
