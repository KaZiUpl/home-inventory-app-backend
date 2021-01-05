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
          "content": "{\n    \"message\": \"Collaborator deleted\"\n}",
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
          "content": "{\n    \"message\": \"House deleted\"\n}",
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
    "description": "<p>Returns an array of house collaborators.</p>",
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
          "content": "[\n    {\n        \"_id\": \"5fd4a0ca340e8d405cd76507\",\n        \"login\": \"KaZiUpl\"\n    }\n]",
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
    "description": "<p>Return an object containing house information as well as array of rooms that belong to the requested house. Each room contains an array of it's storage items.</p>",
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
            "type": "Object[]",
            "optional": false,
            "field": "collaborators",
            "description": "<p>Array of house collaborators</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "collaborators._id",
            "description": "<p>Collaborator's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "collaborators.login",
            "description": "<p>Collaborator's login</p>"
          },
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
            "field": "rooms._id",
            "description": "<p>room's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.name",
            "description": "<p>room's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.description",
            "description": "<p>room's description'</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.house",
            "description": "<p>house id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms.storage",
            "description": "<p>room storage</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage._id",
            "description": "<p>storage item id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rooms.storage.item",
            "description": "<p>item reference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage.item._id",
            "description": "<p>item's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage.item.name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage.quantity",
            "description": "<p>storage item's quantity</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage.description",
            "description": "<p>storage item's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.storage.expiration",
            "description": "<p>storage item's expiration date</p>"
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
            "description": "<p>house owner reference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner._id",
            "description": "<p>house owner id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner.login",
            "description": "<p>house owner login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"collaborators\": [\n        {\n            \"_id\": \"5fd4a0ca340e8d405cd76507\",\n            \"login\": \"KaZiUpl\"\n        }\n    ],\n    \"rooms\": [\n        {\n            \"_id\": \"5ff324fae7613431908d3e27\",\n            \"storage\": [\n                {\n                    \"_id\": \"5ff3283d81a1883a146c7c18\",\n                    \"item\": {\n                        \"_id\": \"5ff32565ab575e1cf4120159\",\n                        \"name\": \"Test item\"\n                    },\n                    \"quantity\": 5,\n                    \"expiration\": \"2020-12-24T17:30:00.000Z\",\n                    \"description\": \"new storage item description\"\n                }\n            ],\n            \"name\": \"new room name\",\n            \"description\": \"new room description\",\n            \"house\": \"5ff323d07e31d80928d4a5a4\",\n            \"__v\": 2\n        }\n    ],\n    \"_id\": \"5ff323d07e31d80928d4a5a4\",\n    \"name\": \"New test house name\",\n    \"description\": \"New test house description\",\n    \"owner\": {\n        \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n        \"login\": \"Test2\"\n    },\n    \"__v\": 3\n}",
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
    "description": "<p>Return an array of houses that user owns and is a collaborator in.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "collaborators",
            "description": "<p>Array of collaborator ids</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "rooms",
            "description": "<p>Array of room ids</p>"
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
            "description": "<p>house owner</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner._id",
            "description": "<p>house owner id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner.login",
            "description": "<p>house owner login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\n        \"collaborators\": [\n            \"5fd4a0ca340e8d405cd76507\"\n        ],\n        \"rooms\": [\n            \"5ff324fae7613431908d3e27\",\n            \"5ff3250eab575e1cf4120157\"\n        ],\n        \"_id\": \"5ff323d07e31d80928d4a5a4\",\n        \"name\": \"New test house name\",\n        \"description\": \"New test house description\",\n        \"owner\": {\n            \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n            \"login\": \"Test2\"\n        },\n        \"__v\": 3\n    },\n    {\n        \"collaborators\": [],\n        \"rooms\": [],\n        \"_id\": \"5ff32409f7670a19a4e08250\",\n        \"name\": \"Test house 2\",\n        \"description\": \"Test house 2 description\",\n        \"owner\": {\n            \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n            \"login\": \"Test2\"\n        },\n        \"__v\": 0\n    }\n]",
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
    "url": "/houses/:id/storage",
    "title": "Get the list of storage items from all house rooms",
    "name": "GetHouseStorage",
    "group": "House",
    "permission": [
      {
        "name": "house owner, house collaborator"
      }
    ],
    "description": "<p>Returns a list of storage items from all of the house rooms.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Storage item id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Storage item quantity</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "expiration",
            "description": "<p>Storage item expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Storage item description</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item reference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item._id",
            "description": "<p>Item id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.name",
            "description": "<p>Item name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.description",
            "description": "<p>Item description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.owner",
            "description": "<p>Item owner</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "room",
            "description": "<p>Room reference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room._id",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "room.name",
            "description": "<p>Room name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n {\n     \"_id\": \"5fccb43bbf6d7110f05d78c8\",\n     \"item\": {\n         \"_id\": \"5fc3f66286d62d1540799523\",\n         \"name\": \"name\",\n         \"description\": \"asd\",\n         \"owner\": \"5fbe83acf4a9ae3450523667\",\n         \"__v\": 0\n     },\n     \"quantity\": 2,\n     \"expiration\": \"1970-01-19T14:17:58.580Z\",\n     \"description\": \"another description\",\n     \"room\": {\n         \"_id\": \"5fbe83e4f4a9ae345052366b\",\n         \"name\": \"room1\"\n     }\n },\n {\n     \"_id\": \"5fccb45abf6d7110f05d78ca\",\n     \"item\": {\n         \"_id\": \"5fc3f4ba865c05280c628c34\",\n         \"name\": \"name\",\n         \"description\": \"asd\",\n         \"owner\": \"5fbe83acf4a9ae3450523667\",\n         \"__v\": 0\n     },\n     \"quantity\": 2,\n     \"expiration\": \"1970-01-19T14:17:58.580Z\",\n     \"description\": \"description\",\n     \"room\": {\n         \"_id\": \"5fbe83e4f4a9ae345052366b\",\n         \"name\": \"room1\"\n     }\n }\n]",
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
    "description": "<p>Returns an array of house rooms.</p>",
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
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "storage",
            "description": "<p>Array of room storage items</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "storage._id",
            "description": "<p>storage item id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "storage.item",
            "description": "<p>item id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "storage.quantity",
            "description": "<p>storage item quantity</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "storage.expiration",
            "description": "<p>storage item expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "storage.description",
            "description": "<p>storage item description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "[\n    {\n        \"_id\": \"5ff324fae7613431908d3e27\",\n        \"storage\": [\n            {\n                \"_id\": \"5ff3283d81a1883a146c7c18\",\n                \"item\": \"5ff32565ab575e1cf4120159\",\n                \"quantity\": 5,\n                \"expiration\": \"2020-12-24T17:30:00.000Z\",\n                \"description\": \"storage item description\"\n            }\n        ],\n        \"name\": \"Test room\",\n        \"description\": \"test room description\",\n        \"house\": \"5ff323d07e31d80928d4a5a4\",\n        \"__v\": 2\n    },\n    {\n        \"_id\": \"5ff3250eab575e1cf4120157\",\n        \"storage\": [],\n        \"name\": \"Test room 2\",\n        \"description\": \"Test room 2 description\",\n        \"house\": \"5ff323d07e31d80928d4a5a4\",\n        \"__v\": 0\n    }\n]",
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
          "content": "{\n    \"message\": \"Collaborator added\"\n}",
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
          "content": "{\n    \"message\": \"House created\",\n    \"id\": \"5ff323d07e31d80928d4a5a4\"\n}",
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
          "content": "{\n    \"message\": \"Room created\",\n    \"id\": \"5ff324fae7613431908d3e27\"\n}",
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
          "content": "{\n    \"message\": \"House info updated\"\n}",
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
          "content": "{\n    \"message\": \"Item deleted\"\n}",
          "type": "json"
        }
      ]
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
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>item's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>item's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "manufacturer",
            "description": "<p>item's manufacturer</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>item's owner</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner._id",
            "description": "<p>item owner's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner.login",
            "description": "<p>item owner's login</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"_id\": \"5ff32565ab575e1cf4120159\",\n    \"name\": \"Test item\",\n    \"description\": \"Test item description\",\n    \"manufacturer\": \"Test manufacturer\",\n    \"owner\": {\n        \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n        \"login\": \"Test2\"\n    },\n    \"__v\": 0\n}",
          "type": "json"
        }
      ]
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
    "description": "<p>Returns array of user's items and global items.</p>",
    "name": "GetItems",
    "group": "Item",
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
            "field": "_id",
            "description": "<p>item's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>item's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "manufacturer",
            "description": "<p>item's manufacturer</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "owner",
            "description": "<p>item's owner id (field does not exist on global items)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "[\n    {\n        \"_id\": \"5fea3f4411a2ed3c28356ae2\",\n        \"name\": \"Global item name\",\n        \"description\": \"global item description\",\n        \"__v\": 0\n    },\n    {\n        \"_id\": \"5ff32565ab575e1cf4120159\",\n        \"name\": \"Test item\",\n        \"description\": \"Test item description\",\n        \"manufacturer\": \"Test manufacturer\",\n        \"owner\": \"5ff3217ced3a2e44d4970bb6\",\n        \"__v\": 0\n    }\n]",
          "type": "json"
        }
      ]
    },
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
            "description": "<p>Created item's id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"message\": \"Item created\",\n    \"id\": \"5ff32565ab575e1cf4120159\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/items.js",
    "groupTitle": "Item",
    "groupDescription": "<p>This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.</p>"
  },
  {
    "type": "post",
    "url": "/items/:id/photo",
    "title": "Upload item's photo",
    "description": "<p>Uploads a photo of the item. Request is required to be on Content-Type: multipart/form-data. Allowed file types are jpg and png.</p>",
    "name": "PostItemImage",
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
            "type": "File",
            "optional": false,
            "field": "image",
            "description": "<p>item's image</p>"
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>item's description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "manufacturer",
            "description": "<p>item's manufacturer</p>"
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
          "content": "{\n    \"message\": \"Item updated\"\n}",
          "type": "json"
        }
      ]
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
          "content": "{\n    \"message\": \"Room deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "delete",
    "url": "/rooms/:roomId/storage/:itemId",
    "title": "Delete an item from a room's storage",
    "name": "DeleteStorageItem",
    "group": "Room",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "storageId",
            "description": "<p>Storage item id</p>"
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
          "content": "{\n    \"message\": \"Storage item deleted successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "post",
    "url": "/rooms/:roomId/storage",
    "title": "Add item to room's storage",
    "name": "DostStorageItem",
    "group": "Room",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item",
            "description": "<p>Item id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Quantity of item (optional, default=1, min. value = 1)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expiration",
            "description": "<p>Expiration date timestamp (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Storage item description (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>created storage item id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"message\": \"Storage item added to the room\",\n    \"id\": \"5ff327ecc0136323bcbc01fa\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "put",
    "url": "/rooms/:roomId/storage/:itemId",
    "title": "Update storage item info",
    "name": "DutStorageItem",
    "group": "Room",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "storageId",
            "description": "<p>Storage item id</p>"
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
          "content": "{\n    \"message\": \"Storage item updated successfully\"\n}",
          "type": "json"
        }
      ]
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
    "description": "<p>Returns an object containing information about a room and limited info about a house</p>",
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
    "success": {
      "fields": {
        "Success 200": [
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
            "type": "Object[]",
            "optional": false,
            "field": "storage",
            "description": "<p>Room's storage items</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "house",
            "description": "<p>House info</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"_id\": \"5fc3f6a786d62d1540799526\",\n    \"storage\": [\n        {\n            \"_id\": \"5fc3f6bc86d62d1540799527\",\n            \"item\": \"5fc3f66286d62d1540799523\",\n            \"quantity\": 2\n        },\n        {\n            \"_id\": \"5fc3f6d186d62d1540799528\",\n            \"item\": \"5fc3f66286d62d1540799523\",\n            \"quantity\": 2\n        },\n        {\n            \"_id\": \"5fc3f6d286d62d1540799529\",\n            \"item\": \"5fc3f66286d62d1540799523\",\n            \"quantity\": 2\n        },\n        {\n            \"_id\": \"5fc3f6d386d62d154079952a\",\n            \"item\": \"5fc3f66286d62d1540799523\",\n            \"quantity\": 2\n        }\n    ],\n    \"name\": \"new name 3\",\n    \"house\": {\n        \"_id\": \"5fc3f6a086d62d1540799525\",\n        \"name\": \"house\"\n    },\n    \"description\": \"room description\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "get",
    "url": "/rooms/:roomId/storage",
    "title": "Get room's storage",
    "name": "GetRoomStorage",
    "group": "Room",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "description": "<p>Return an array of room's storage items</p>",
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
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Storage item id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item._id",
            "description": "<p>item's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.description",
            "description": "<p>item's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.manufacturer",
            "description": "<p>item's manufacturer name</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item.owner",
            "description": "<p>item's owner info</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.owner._id",
            "description": "<p>item's owner id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.owner.login",
            "description": "<p>item's owner login</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Storage item description</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Quantity of item</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expiration",
            "description": "<p>Storage item expiration date</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "[\n    {\n        \"_id\": \"5ff3283d81a1883a146c7c18\",\n        \"item\": {\n            \"_id\": \"5ff32565ab575e1cf4120159\",\n            \"name\": \"Test item\",\n            \"description\": \"Test item description\",\n            \"manufacturer\": \"Test manufacturer\",\n            \"owner\": {\n                \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n                \"login\": \"Test2\"\n            },\n            \"__v\": 0\n        },\n        \"quantity\": 1,\n        \"expiration\": \"2020-12-24T17:30:00.000Z\",\n        \"description\": \"Storage item description\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/rooms.js",
    "groupTitle": "Room",
    "groupDescription": "<p>Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.</p>"
  },
  {
    "type": "get",
    "url": "/rooms/:roomId/storage/:itemId",
    "title": "Get storage item info",
    "name": "GetStorageItem",
    "group": "Room",
    "permission": [
      {
        "name": "house owner or collaborator"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "roomId",
            "description": "<p>Room id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "storageId",
            "description": "<p>Storage item id</p>"
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
            "field": "_id",
            "description": "<p>Storage item id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.name",
            "description": "<p>item's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.description",
            "description": "<p>item's description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.manufacturer",
            "description": "<p>item's manufacturer name</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item.owner",
            "description": "<p>item's owner info</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.owner._id",
            "description": "<p>item's owner id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "item.owner.login",
            "description": "<p>item's owner login</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Quantity of item</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expiration",
            "description": "<p>Storage item expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Storage item description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"_id\": \"5ff3283d81a1883a146c7c18\",\n    \"item\": {\n        \"_id\": \"5ff32565ab575e1cf4120159\",\n        \"name\": \"Test item\",\n        \"description\": \"Test item description\",\n        \"manufacturer\": \"Test manufacturer\",\n        \"owner\": {\n            \"_id\": \"5ff3217ced3a2e44d4970bb6\",\n            \"login\": \"Test2\"\n        },\n        \"__v\": 0\n    },\n    \"quantity\": 1,\n    \"expiration\": \"2020-12-24T17:30:00.000Z\",\n    \"description\": \"Storage item description\"\n}",
          "type": "json"
        }
      ]
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
    "success": {
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n    \"message\": \"Room modified\"\n}",
          "type": "json"
        }
      ]
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
          "content": "{\n    \"login\": \"Test\",\n    \"email\": \"test@example.com\",\n    \"role\": \"user\",\n    \"__v\": 0\n}",
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
          "content": "{\n    \"message\": \"User created successfully\",\n    \"id\": \"5ff3217ced3a2e44d4970bb6\"\n}",
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
            "field": "login",
            "description": "<p>User's login</p>"
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
          "content": "{\n    \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjA5NzcwMzA3LCJpYXQiOjE2MDk3Njk0MDd9.v3hm8uHzp8BexJBuixJLV-8ADoyzXacH2FUzwCjxMWY\",\n    \"refresh_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjQxMzA1NDA3LCJpYXQiOjE2MDk3Njk0MDd9.NBgQ2eZT-SXl8CIXmYv-iqF1N-8Ks-6xjk2fbV4l-VQ\",\n    \"expires\": \"2021-01-04T14:25:07.000Z\",\n    \"id\": \"5ff3217ced3a2e44d4970bb6\",\n    \"email\": \"test@example.com\",\n    \"login\": \"Test\",\n    \"role\": \"user\"\n}",
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
          "content": "{\n    \"message\": \"User logged out\"\n}",
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
            "field": "login",
            "description": "<p>User's login</p>"
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
          "content": "{\n    \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjA5NzcwNTMwLCJpYXQiOjE2MDk3Njk2MzB9.URROkh-tZ6Vx0dzpoYmmoIwDL0vxGm53gO29XaI46lM\",\n    \"refresh_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpZCI6IjVmZjMyMTdjZWQzYTJlNDRkNDk3MGJiNiIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjQxMzA1NDA3LCJpYXQiOjE2MDk3Njk0MDd9.NBgQ2eZT-SXl8CIXmYv-iqF1N-8Ks-6xjk2fbV4l-VQ\",\n    \"expires\": \"2021-01-04T14:28:50.000Z\",\n    \"id\": \"5ff3217ced3a2e44d4970bb6\",\n    \"email\": \"test@example.com\",\n    \"login\": \"Test\",\n    \"role\": \"user\"\n}",
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
          "content": "{\n    \"message\": \"User modified\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  }
] });
