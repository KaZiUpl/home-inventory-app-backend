define({ "api": [
  {
    "type": "get",
    "url": "/users",
    "title": "Hello world route",
    "name": "HelloWorld",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Hello world message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response(example):",
          "content": "{\n  \"msg\": \"Hello World!\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  }
] });
