  /*/products/*/


  var defaults = require('../constants');
  var db = GLOBAL.db;
  var routes_helper = require('../routes_helper');
  var storage = GLOBAL.storage;

  function GenericRoute(name) {
      //console.log("Route: " + name);
      this.protected = [];
      this.route = '/' + name;
      var route = this.route;
      var collection = db.collection(name);

      var sort = function (req, res, next) {
          if (typeof req.params.sort === 'undefined' || req.params.sort === null || req.params.sort == '') {
              req.toSort = false;
              return next();
          }
          req.toSort = true;
          req.sort_criteria = {};
          req.sort_criteria[req.params.sort] = 1;
          if (!(typeof req.params.sort_order === 'undefined' || req.params.sort === null || req.params.sort == '')) {
              if (req.params.sort_order.toLowerCase() === 'desc')
                  req.sort_criteria[req.params.sort] = -1;
              delete req.params.sort_order;
          }
          delete req.params.sort;
          return next();
      }

      var getFn = function (req, res, next) {
          res.set('content-type', 'application/json; charset=utf-8');
          console.log("Get request");
          var lastModif = storage.getItem(name);
          console.log("Stored " + lastModif);
          if (!lastModif) {
              lastModif = new Date().toString();
              storage.setItem(name, lastModif);
          }
          console.log('Last modified: ' + lastModif);
          res.header('Last-Modified', lastModif);
          res.header('Date', new Date().toString());
          console.log("Date :" + new Date().toString());

          var hidePasswordProjection = {
              password: 0
          };
          if (req.decoded) hidePasswordProjection = {};
          console.log(JSON.stringify(req.params));
          if (req.toSort) {
              collection.find(req.params, hidePasswordProjection).sort(req.sort_criteria, function (err, docs) {
                  if (err) res.send(500, err);
                  else res.send(docs);
              })
          } else {
              collection.find(req.params, hidePasswordProjection, function (err, docs) {
                  if (err) res.send(500, err);
                  else res.send(docs);
              });
          }
          return next();
      }


      this.get = function () {
          var pre = [];
          var mid = [];
          if (this.protected.contains('get')) {
              mid = mid.concat([routes_helper.check_token, routes_helper.check_master]);
          }
          var fin = [sort, getFn];
          return pre.concat(mid).concat(fin);
      };

      var headFN = function (req, res, next) {
          res.set('content-type', 'application/json; charset=utf-8');
          console.log("Get request");
          var lastModif = storage.getItem(name);
          console.log("Stored " + lastModif);
          if (!lastModif) {
              lastModif = new Date().toString();
              storage.setItem(name, lastModif);
          }
          console.log('Last modified: ' + lastModif);
          res.header('Last-Modified', lastModif);
          res.header('Date', new Date().toString());
          console.log("Date :" + new Date().toString());
          res.send(200);
      }

      this.head = function () {
          var pre = [];
          var mid = [];
          if (this.protected.contains('head')) {
              mid = mid.concat([routes_helper.check_token, routes_helper.check_master]);
          }
          var fin = [headFN];
          return pre.concat(mid).concat(fin);
      };


      var postFN = function (req, res, next) {
          res.set('content-type', 'application/json; charset=utf-8');
          collection.insert(req.body, function (err, resp) {
              if (err) res.send(500, err);
              else {
                  storage.setItem(name, new Date().toString());
                  res.send(201, resp);
              }
          })
          return next();
      }

      this.post = function () {
          var pre = [routes_helper.check_token];
          var mid = [];
          if (this.protected.contains('post')) {
              mid = mid.concat([routes_helper.check_master]);
          }
          var fin = [postFN];
          return pre.concat(mid).concat(fin);
      };
  }






  module.exports = GenericRoute;