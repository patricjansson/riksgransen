Riksgränsen - Better Express.js Routing
===========

This will soon be a npm module, for now its just code taken from a other project not working as intended.

Riksgränsen inverst routing in  Express.js and dynamically adds CRUD and REST support by defining routes as a JSON-object.

The core structure JSON-object
------------------------------
The site stucture is the web paths as described by json. In the siteStructure example bellow.

```json
var siteStructure = {
  home : {
    param: 'username',
    memberships : {
      param : 'id',
      name : '_groups'
    }
  },
  admin : {
    site : {
      restVerbs : 'crud',
      param : 'id'
    },
    user : {
      restVerbs : 'ru',
      param : 'username'
    }
  }
}
```
After adding routes
```json
var siteStructure = {
  home : {
    param: 'username',
    readRoute : function(controller, req, res)
    memberships : {
      param : 'id',
      name : '_groups',
      readRoute : function(controller, req, res)
    }
  },
  admin : {
    readRoute : function(controller, req, res)                                         
    site : {
      restVerbs : 'crud',
      param : 'id',
      createRoute : function(controller, req, res)
      readRoute : function(controller, req, res)
      updateRoute : function(controller, req, res)
      deleteRoute : function(controller, req, res)
    },
    user : {
      restVerbs : 'ru',
      param : 'username',
      readRoute : function(controller, req, res)
      updateRoute : function(controller, req, res)
    }
  }
}
```


Url:s would be:
```html
 GET    '/home/:username'
 GET    '/home/:username/_groups/:id'
 GET    '/admin'
 POST   '/site'
 GET    '/admin/site/:id'
 PUT    '/site'
 DELETE '/site/:id'
 GET    '/admin/user/:username'
 PUT    '/user'

```

Riksgränsen takes this site structure and traverse all nodes and dynamicly adds `'c'reate`, `'r'ead`, `'u'pdate`, `'d'elete` functions to each node according to restVerbs specified on a node. The crud-functions wraps the correct Express.js routing methods after building the correct route string for each node (i.e '/admin/site/:id').

Routing using the site structure
--------------------------------

Invoking the REST verbs as functions removs the job of passing strings, and methods to Express. Since Riksgränsen works with objects, each node handles and registers functions for it´s verbs.

```javascript
var routing = require('./paths.js')(express, siteStructure);

routing.admin.site.create(callback)
routing.admin.site.read(callback)
routing.admin.site.update(callback)
routing.admin.site.delete(callback)
```

In Express.js the code above would be.
```javascript
express.post("/admin/site/", callback)
express.get("/admin/site/:id", callback)
express.put("/admin/site/", callback)
express.delete("/admin/site/:id", callback)
```


Reverse parameterized URL lookup
------------------------------
The nodes in the site structure also gets a function `url(optionalValue)` added on startup that allows reverse url building from a route, even if the route is parameterized. In the example `/admin/site/:id`, `admin.site.url('my-site')` would resolve to url `/admin/site/my-site` (:id is only added if passed to url()). This is very useful in templates where you no longer have to use strings as links. Any broken link will generate a runtime error.
