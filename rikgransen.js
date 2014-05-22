var express = require('express');
var controller = require('./controller.js');
var express = express();

/****************** Site Structure / Routing ******************/

// The site stucture is the web paths as described by json.
// in the siteStructure example bellow. Url:s would be:
// /home
// /admin
// /admin/site
// /admin/user
// Riksgränsen takes this site structure and traverse all
// nodes and dynamicly adds 'c'reate, 'r'ead, 'u'pdate, 'd'elete
// functions to each node according to restVerbs specified on a node.
// The crud-functions wraps the correct Express.js routing methods after
// building the correct route string (i.e '/admin/site/:id')
//
// The nodes in the site structure also gets a function url(optionalValue)
// added on startup that allows reverse url building from a route, even if
// the route is parameterized.
// In the example '/admin/site/:id' admin.site.url('my-site') whould return
// a url '/admin/site/my-site'. This is very useful in templates where you
// no longer have to use strings as links. Any broken link will generate a
// runtime error.

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

var routing = require('./paths.js')(express, siteStructure);

/****************** Configuration ******************/


//******************************************************
// CRUD with RESTful routing
//******************************************************

// GET on /home
// Get is added as default method if no restVerbs is specified in siteStructure JSON.
// al other restVerbs (r, u, d) are not specified as present on '/home', so does
// routes are not added to the server. If you try to access for example
// routing.home.create(callback), you whould get a runtime error becaouse the create()
// is not added to the object 'home.'
routing.home.read(controller.defaultCallback)

// POST on /admin/site
routing.admin.site.create(controller.idCallback)
// GET on /admin/site/:id callback is passed req, res as parameters.
routing.admin.site.read(controller.idCallback);
// PUT on /admin/site/:id
routing.admin.site.update(controller.idCallback)
// DELETE on /admin/site/:id
routing.admin.site.delete(controller.idCallback)

// GET on /admin/user/:username
routing.admin.user.read(controller.userCallback)
// PUT on /admin/user
routing.admin.user.update(function(req, res){ res.send('Sorry, update not implemented yet.') })

express.listen(3000, function() {
  console.log('------------------------------------------');
  console.log('Start by pointing your brower to http://localhost:3000' + routing.admin.site.url('my-site-id') );
  console.log('------------------------------------------');
});
