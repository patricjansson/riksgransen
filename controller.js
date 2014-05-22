module.exports = function() {
  var defaultCallback =  function(req, res) {
    res.send("This is the default response.");
  }

  var userCallback = function(req, res) {
    res.send('User: \'' + req.params.username + '\'');
  }

  var idCallback = function(req, res) {
    res.send('Id: \'' + req.params.id + '\'');
  }

  return {
    defaultCallback : defaultCallback,
    userCallback : userCallback,
    idCallback : idCallback
  }
}
