Riksgränsen - Better Express.js Routing
===========

This will soon be a npm module, for now its just code taken from a other project not working as intended.

Riksgränsen inverst routing in  Express.js and dynamically adds CRUD and REST support by defining routes as a JSON-object.

The core structure JSON-object
------------------------------
The site stucture is the web paths as described by json. In the siteStructure example bellow.

```json
var siteStructure = {
  home : { },
  admin : {
    site : {
      restVerbs : 'crud',
      param : 'id',
    },
    user : {
      restVerbs : 'ru',
      param : 'username'
    }
  }
}
```

Url:s would be:
```html
/home
/admin
/admin/site
/admin/user
```

Riksgränsen takes this site structure and traverse all nodes and dynamicly adds `'c'reate`, `'r'ead`, `'u'pdate`, `'d'elete` functions to each node according to restVerbs specified on a node. The crud-functions wraps the correct Express.js routing methods after building the correct route string for each node (i.e '/admin/site/:id').

Reverse parameterized URL lookup
------------------------------
The nodes in the site structure also gets a function `url(optionalValue)` added on startup that allows reverse url building from a route, even if the route is parameterized. In the example `/admin/site/:id`, `admin.site.url('my-site')` would resolve to url `/admin/site/my-site` (:id is only added if passed to url()). This is very useful in templates where you no longer have to use strings as links. Any broken link will generate a runtime error.
