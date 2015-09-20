var restify = require('restify'),
    constants = require('./constants');

var server = restify.createServer({
    name: 'Attendances',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(restify.fullResponse());



//server.get("/addcollection/:name", function (req, res) {
//    if(typeof req.params.name === 'undefined'){
//        res.send(400,'Collection name invalid');
//    }
//    var collection = db.collection(req.params.name);
//        res.send(201);
//    
//});
var db = GLOBAL.db;
var Route = require('./model/collection');

db.getCollectionNames(function (err, collections) {
    if (err) return console.log(err);
    console.log(collections);
    collections.forEach(function (col) {
        console.log("Generating route for: " + col);
        var route = new Route(col);
        console.log(JSON.stringify(route));
//        console.log(typeof route.get);
        if (typeof route.get === "function") {
            server.get(route.route, route.get);
        }
        if ( typeof route.post === "function") {
            server.post(route.route, route.post);
        }
        if (typeof route.put === "function") {
            server.put(route.route, route.put);
        }
        if ( typeof route.del === "function") {
            server.del(route.route, route.del);
        }
    });
});




module.exports = server;