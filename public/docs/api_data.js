define({ "api": [
  {
    "type": "delete",
    "url": "/houses/:id/collaborators/:userId",
    "title": "Remove a collaborator",
    "name": "DeleteCollaborator",
    "group": "House",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "description": "<p>Removes user with provided id from collaborators list. Can be used either by house owner or one of its collaborators in order to remove oneself from collaborating.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>house id</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n     \"message\": \"Collaborator deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "delete",
    "url": "/houses/:id",
    "title": "Delete a house",
    "name": "DeleteHouse",
    "group": "House",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>house id</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"message\": \"House deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "get",
    "url": "/houses/:id/collaborators",
    "title": "Get the list of collaborators",
    "name": "GetCollaboratorList",
    "group": "House",
    "permission": [
      {
        "name": "House owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>house id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>Array of collaborators</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Collaborator's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Collaborator's login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "[\n  {\n      \"_id\": \"5f327188295d5f121464d782\",\n      \"login\": \"kacperkaz\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "get",
    "url": "/houses/:id",
    "title": "Get house info",
    "name": "GetHouseInfo",
    "group": "House",
    "permission": [
      {
        "name": "house owner or collaborators"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the house</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Requested",
            "description": "<p>house</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "collaborators",
            "description": "<p>Array of collaborators' logins and ids</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>house's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the house</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the house</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>Object with owner's id and login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"collaborators\": [\n     {\n         \"_id\": \"5f327188295d5f121464d782\",\n         \"login\": \"kacperkaz\"\n     }\n ],\n \"_id\": \"5f438a3f1b69ff37807e2a0c\",\n \"name\": \"asd\",\n \"description\": \"some description\",\n \"owner\": {\n     \"_id\": \"5f2584b9bb2de6e74fd3b39e\",\n       \"login\": \"admin\"\n  },\n  \"__v\": 3\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "get",
    "url": "/houses",
    "title": "Get the list of houses",
    "name": "GetHouseList",
    "group": "House",
    "permission": [
      {
        "name": "logged in user"
      }
    ],
    "description": "<p>Returns a list of houses that user owns or is collaborating in.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "houses",
            "description": "<p>Array of user's houses</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "collaborators",
            "description": "<p>Array of collaborator's id's</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>House id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the house</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the house</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>Object with owner's id and login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"collaborators\": [\n         \"5f327188295d5f121464d782\"\n    ],\n    \"_id\": \"5f438a3f1b69ff37807e2a0c\",\n   \"name\": \"asd\",\n   \"description\": \"some description\",\n   \"owner\": {\n       \"_id\": \"5f2584b9bb2de6e74fd3b39e\",\n       \"login\": \"admin\"\n   },\n  \"__v\": 3\n}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "get",
    "url": "/houses/:id/rooms",
    "title": "Get the list of rooms",
    "name": "GetRoomsList",
    "group": "House",
    "permission": [
      {
        "name": "House owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>house id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms",
            "description": "<p>Array of house rooms</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Room description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "house",
            "description": "<p>House id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "[\n{\n  \"_id\": \"5f5775f5e8b1493d3c82ebca\",\n  \"name\": \"room1\",\n  \"description\": \"description\",\n  \"house\": \"5f576dedb9d20a30e02e81e6\",\n  \"__v\": 0\n}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "post",
    "url": "/houses/:id/collaborators",
    "title": "Add a collaborator",
    "name": "PostAddCollaborator",
    "group": "House",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "description": "<p>Adds a user as a collaborator. First user with matching login or email is added.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>house id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>login or email of the collaborator</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n     \"message\": \"Collaborator added.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "post",
    "url": "/houses",
    "title": "Create new house",
    "name": "PostHouse",
    "group": "House",
    "permission": [
      {
        "name": "logged in user"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the house</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the house</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of created house</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n     \"message\": \"House created.\"\n     \"id\": \"5f576dedb9d20a30e02e81e6\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "post",
    "url": "/houses/:id/rooms",
    "title": "Create a room",
    "name": "PostRoom",
    "group": "House",
    "description": "<p>Creates a room in a house with provided id</p>",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>House id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Room's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Room's description</p>"
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
            "field": "message",
            "description": "<p>message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of created room</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n \"message\": \"Room created.\",\n\"id\": \"5f576dedb9d20a30e02e81e6\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "put",
    "url": "/houses/:id",
    "title": "Modify house info",
    "name": "PutHouseInfo",
    "group": "House",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>New name of the house</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>New description of the house</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"message\": \"House info updated.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/houses.js",
    "groupTitle": "House",
    "groupDescription": "<p>Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.</p>"
  },
  {
    "type": "delete",
    "url": "/items/:id",
    "title": "Delete item",
    "name": "DeleteItem",
    "group": "Item",
    "permission": [
      {
        "name": "item's owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>item's id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "get",
    "url": "/items/:id",
    "title": "Get item info",
    "name": "GetItem",
    "group": "Item",
    "permission": [
      {
        "name": "item's owner or logged in user"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>item's id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "get",
    "url": "/items/",
    "title": "Get item list",
    "name": "GetItems",
    "group": "Item",
    "permission": [
      {
        "name": "logged in user"
      }
    ],
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "post",
    "url": "/items",
    "title": "Create new item",
    "name": "PostItem",
    "group": "Item",
    "permission": [
      {
        "name": "everyone"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>item name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>item description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "manufacturer",
            "description": "<p>item's manufacturer name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "photo",
            "description": "<p>image data base64 encoded</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "put",
    "url": "/items/:id",
    "title": "Update item info",
    "name": "PutItem",
    "group": "Item",
    "permission": [
      {
        "name": "item's owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>item's id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "delete",
    "url": "/rooms/:id",
    "title": "Delete a room",
    "name": "DeleteRoom",
    "group": "Room",
    "description": "<p>Deletes a room with provided id</p>",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Room id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "get",
    "url": "/rooms/:id",
    "title": "Get room info",
    "name": "GetRoom",
    "group": "Room",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Room id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "put",
    "url": "/rooms/:id",
    "title": "Modify a room",
    "name": "PutRoom",
    "group": "Room",
    "description": "<p>Modifies room's name and description</p>",
    "permission": [
      {
        "name": "house owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Room's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Room's description</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get user info",
    "name": "GetUserInfo",
    "group": "User",
    "permission": [
      {
        "name": "logged in user"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>User's login</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"login\": \"user\",\n    \"email\": \"john_doe@gmail.com\",\n    \"role\": \"user\",\n}",
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"message\": \"User created.\"\n}",
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
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expires",
            "description": "<p>Expiry date of access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n  \"refresh_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n  \"expires\": \"2020-08-03T11:11:13.000Z\",\n  \"id\": \"5f2584b9bb2de6e74fd3b39e\",\n  \"email\": \"john_doe@gmail.com\",\n  \"role\": \"user\"\n}",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User's refresh token</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"message\": \"User logged out.\"\n}",
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
    "url": "/users/auth/refresh",
    "title": "Refresh access token",
    "name": "PostRefreshToken",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User's refresh token</p>"
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
            "description": "<p>New access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>Refresh token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expires",
            "description": "<p>Expiry date of access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n  \"refresh_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n  \"expires\": \"2020-08-03T11:11:13.000Z\",\n  \"id\": \"5f2584b9bb2de6e74fd3b39e\",\n  \"email\": \"john_doe@gmail.com\",\n  \"role\": \"user\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id/login",
    "title": "Change user's login",
    "name": "PutChangeLogin",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>New login</p>"
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
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"message\": \"Login changed.\"\n}",
          "type": "json"
        }
      ]
    },
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
    "permission": [
      {
        "name": "logged in user"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"message\": \"User modified.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  }
] });
