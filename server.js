var restify = require('restify'),
    Engine = require('tingodb')(),
    assert = require('assert');

var server = restify.createServer({
    name: 'Attendances',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());
server.get("/createdb", function (req, res) {
    var collection = db.collection("batch_document_insert_collection_safe");
    collection.insert([{
            hello: 'world_safe1'
    }
  , {
            hello: 'world_safe2'
    }], {
        w: 1
    }, function (err, result) {
        assert.equal(null, err);

        collection.findOne({
            hello: 'world_safe2'
        }, function (err, item) {
            assert.equal(null, err);
            assert.equal('world_safe2', item.hello);
        })
    });
});
var db = new Engine.Db('/db/attendance', {});
GLOBAL.db = db;

db.collectionNames(function (err, collections) {
    
});





module.exports = server;