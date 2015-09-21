////HACK
Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};
////---HACK


var restify = require('restify'),
    constants = require('./constants');

var server = restify.createServer({
    name: 'Attendances',
    version: '1.0.0'
});


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(function (req, res, next) {
    req.secretsalt = constants.secret;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', '*');
    next();
});
restify.CORS.ALLOW_HEADERS.push('sid');
server.use(restify.CORS());
server.use(restify.fullResponse());



//server.get("/addcollection/:name", function (req, res) {
//    if(typeof req.params.name === 'undefined'){
//        res.send(400,'Collection name invalid');
//    }
//    var collection = db.collection(req.params.name);
//        res.send(201);
//    
//});
server.get("/echo/:echo", function (req, res) {
    res.send(req.params.echo);
});

var db = GLOBAL.db;

var Route = require('./model/collection');
var RouteDocument = require('./model/document');

var ProtectedRoutes = {
    all: ['/token', '/token/:id','/system.indexes','/system.indexes/:id'],
    get: [],
    post: ['/user','/user/:id'],
    put:['/user','/user/:id'],
    del:['/user','/user/:id']
}
var routes_helper = require('./routes_helper');

function addRoute(route) {
    console.log("Adding: " + route.route);
    if (typeof route.get !== "undefined") {
        var func_params = [route.route];
        if(ProtectedRoutes.all.contains(route.route) || ProtectedRoutes.get.contains(route.route)){
            console.log("\nProtected [Master]");
            route.protected.push('get');
        }
        server.get.apply(server, func_params.concat(route.get()));
        console.log("GET");
    }
    if (typeof route.post !== "undefined") {
        var func_params = [route.route];
        if(ProtectedRoutes.all.contains(route.route) || ProtectedRoutes.post.contains(route.route)){
            console.log("\nProtected [Master]");
            route.protected.push('post');
        }
        server.post.apply(server, func_params.concat(route.post()));
        console.log("POST");
    }
    if (typeof route.put !== "undefined") {
        var func_params = [route.route];
        if(ProtectedRoutes.all.contains(route.route) || ProtectedRoutes.put.contains(route.route)){
            console.log("\nProtected [Master]");
            route.protected.push('put');
        }
        server.put.apply(server, func_params.concat(route.put()));
        console.log("PUT");
    }
    if (typeof route.del !== "undefined") {
        var func_params = [route.route];
        if(ProtectedRoutes.all.contains(route.route) || ProtectedRoutes.del.contains(route.route)){
            console.log("\nProtected [Master]");
            route.protected.push('del');
        }
        server.del.apply(server, func_params.concat(route.del()));
        console.log("DELETE");
    }

}

var login = require('./routes/auth');
addRoute(login);
db.getCollectionNames(function (err, collections) {
    if (err) return console.log(err);
    console.log(collections);
    collections.forEach(function (col) {
        console.log("Generating route for: " + col);
        var route = new Route(col);
        addRoute(route);
        var document_route = new RouteDocument(col);
        addRoute(document_route);
        console.log("\n");
    });
});



module.exports = server;