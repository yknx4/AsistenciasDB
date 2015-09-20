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
server.use(function (req, res, next) {
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
var RouteDocument = require('./model/document');

db.getCollectionNames(function (err, collections) {
    if (err) return console.log(err);
    console.log(collections);
    collections.forEach(function (col) {
        console.log("\nGenerating route for: " + col);
        var route = new Route(col);              
        if (typeof route.get === "function") {
            server.get(route.route,route.sort, route.get);
            console.log("GET");
        }
        if (typeof route.post === "function") {
            server.post(route.route, route.post);
            console.log("POST");
        }
        if (typeof route.put === "function") {
            server.put(route.route, route.put);
            console.log("PUT");
        }
        if (typeof route.del === "function") {
            server.del(route.route, route.del);
            console.log("DELETE");
        }
        console.log("\nGenerating document route for: " + col);
        var document_route = new RouteDocument(col);  
        if (typeof document_route.get === "function" ) {
            server.get(document_route.route,document_route.check_id,document_route.get);
            console.log("GET");
        }
        if (typeof document_route.post === "function") {
            server.post(document_route.route,document_route.check_id, document_route.post);
            console.log("POST");
        }
        if (typeof document_route.put === "function") {
            server.put(document_route.route,document_route.check_id, document_route.put);
            console.log("PUT");
        }
        if (typeof document_route.del === "function") {
            server.del(document_route.route,document_route.check_id, document_route.del);
            console.log("DELETE");
        }
    });
});

module.exports = server;