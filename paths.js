/**
 * Exports the paths representing the paths (routes/url and more) that
 * this Express application uses. Many properties and functions are added
 * on load, see pathBuilder.js
 *
 * Every node in the paths-json is translated into routes and url, if no
 * other attributes are specified on it.
 *
 * Optional properties:
 *  - param : A param name used in routing I.e: /api/:param/
 *  - method : A specific method, defaults to GET.
 *  - method : The method that the path allows, defaults to GET
 *
 * Functions:
 *  - route() : Gets the route to the path. I.e /api/name or /api/name/:id
 *    if a "param : 'id'" is present in the path-json for this path.
 *  - url(value) :  Gets the url to a path. If a value is passed and the
 *    "param : 'id'" is set, the result whould be like /api/name/[value]
 */

module.exports = function(express) {

  var paths = {
        admin : {
          webform : {
            restVerbs : 'crud',
            param : 'id',
            publish : {
              restVerbs : 'u',
              param : 'id'
            },
            unpublish : {
              restVerbs : 'u',
              param : 'id'
            }
          }
        },
        formloader : { },
        webpage : {
          param : 'id'
        },
        testwebpage : {
          param : 'id'
        }
      }

  return require('./pathBuilder')(paths, express)

}
