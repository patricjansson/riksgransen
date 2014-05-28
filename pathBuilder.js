/**
 * OLD ....
 *  Traverse the passed paths json object representing the routes
 * used in a Express application.
 *
 * Every node in the paths-json has the following properties added to it..
 * Properites:
 *  - name : The name of the current path (node) I.e: /api/name/
 *  - parent : The nodes parent node.
 *
 * Functions:
 *  - route() : Gets the route to the path. I.e /api/name or /api/name/:id
 *    if a "param : 'id'" is present in the path-json for this path.
 *  - url(value) :  Gets the url to a path. If a value is passed and the
 *    "param : 'id'" is set, the result whould be like /api/name/[value]
 */

module.exports = function(paths, express) {

  /**
   * Build the Express routing to path.
   */
  var createRoute = function () {

    var createPath = '/' + this.name;

    if (this.parent.createPath == null) {
      return createPath;
    }

    return this.parent.createPath() + createPath;

  }

  /**
   * Build the Express routing to path.
   */
  var readRoute = function () {

    var readPath = '/' + this.name;

    if (this.param) {
      readPath = '/' + this.name + '/:' + this.param;
    }

    if (this.parent == null) {
      return readPath;
    }

    if (this.parent.readRoute == null) {
      return readPath;
    }

    return this.parent.readRoute() + readPath;

  }

  /**
   * Build the Express routing to path.
   */
  var updateRoute = function () {

    var updatePath = '/' + this.name;

    if (this.parent == null) {
      return updatePath;
    }

    if (this.parent.route == null) {
      return updatePath;
    }

    return this.parent.updateRoute() + updatePath;

  }

  /**
   * Build the Express routing to path.
   */
  var deleteRoute = function () {

    var deletePath = '/' + this.name;

    if (this.param) {
      updatePath = '/' + this.name + '/:' + this.param;
    }

    if (this.parent == null) {
      return updatePath;
    }

    if (this.parent.route == null) {
      return updatePath;
    }

    return this.parent.deleteRoute() + updatePath;

  }

  var routeCallback = function(callback, req, res) {
      if (callback) {
        callback(req, res);
        return;
      }
      console.log('ROUTE MISSING CALLBACK: \'' + req.url + '\'.');
      unimplemented(req, res);

  }

  var unimplemented = function(req, res) {
    res.send(405, 'Unimplemented');
  }

  var create = function(req, res, callback) {
    express.post(this.createRoute(), function(req, res) {
      routeCallback(callback, req, res);
    });
  }

  var read = function(callback) {
    express.get(this.readRoute(), function(req, res) {
      routeCallback(callback, req, res);
    });
  }

  var update = function(req, res, callback) {
    express.put(this.updateRoute(), function(req, res) {
      routeCallback(callback, req, res);
    });
  }

  var del = function(req, res, callback) {
    express.delete(this.deleteRoute(), function(req, res) {
      routeCallback(callback, req, res);
    });
  }

  /**
   * Build the url to a path, with or without a value
   * replacing a optional param.
   */
  var toUrl = function(route, values) {
      for (var i = 0; i <= values.length; i++) {
        route = route.replace(/(\/:\w+)/, '/' + values[i]);
      }
      return route;
  }

  function addRoutes(current) {
    if (current.restVerbs) {
      if (current.restVerbs.indexOf('c') > -1) {
        console.log(' POST   \'' + current.createRoute() + '\'');
        current.create = create;
      }
      if (current.restVerbs.indexOf('r') > -1) {
        console.log(' GET    \'' + current.readRoute() + '\'');
        current.read = read;
      }
      if (current.restVerbs.indexOf('u') > -1) {
        console.log(' PUT    \'' + current.updateRoute() + '\'' );
        current.update = update;
      }
      if (current.restVerbs.indexOf('d') > -1) {
        console.log(' DELETE \'' + current.deleteRoute() + '\'');
        current.delete = del;
      }
    } else {
      console.log(' GET    \'' + current.readRoute() + '\'');
      current.read = read;
    }

    return current;
  }

  /**
   * Adding the dynamic properties to the current JSON node.
   * Props: name, parent, method
   * Funcs: route, url
   */
  function addProperties(current, parent, name) {

    if (current.name == null) {
      current.name = name;
    }
    current.parent = parent;

    if (current.restVerbs) {
      if (current.restVerbs.indexOf('c') > -1) {
        current.createRoute = createRoute;
      }
      if (current.restVerbs.indexOf('r') > -1) {
        current.readRoute = readRoute;
      }
      if (current.restVerbs.indexOf('u') > -1) {
        current.updateRoute = updateRoute;
      }
      if (current.restVerbs.indexOf('d') > -1) {
        current.deleteRoute = deleteRoute;
      }
    } else {
      current.readRoute = readRoute;
    }

    return current;

  }

  /**
   * Utility for looping the JSON nodes.
   */
  function traverse(path, current, name) {
    if ((typeof(current) == "object") && (path.hasOwnProperty(name)) && (name != 'parent')) {
      return true;
    }
    return false;
  }

  /**
   * Recursively traverse the path and add properties.
   */
  function buildPaths(path) {

    for (var name in path) {
      var current = path[name];

      if (traverse(path, current, name)) {
        buildPaths(addProperties(current, path, name));
      }

    }
  }

  /**
   * Recursively traverse the path and add properties.
   */
  function buildRoutes(path) {

    for (var name in path) {
      var current = path[name];

      if (traverse(path, current, name)) {
        buildRoutes(addRoutes(current, path, name));
      }

    }
  }

  // Add all properties to the paths passed to this module;
  buildPaths(paths);

  buildRoutes(paths);

  paths.toUrl = toUrl;

  // Finally return the paths json with all properties set.
  return paths;

}
