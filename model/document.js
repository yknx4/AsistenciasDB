/*/products/*/
var db = GLOBAL.db;
var mongojs = require('mongojs');
var defaults = require('../constants');

function GenericRouteSingle(name) {
    console.log("Document Route: " + name);
    this.route = '/' + name + '/:id';
    var collection = db.collection(name);

    this.check_id = function (req, res, next) {
        if (req.params.id === 'undefined' || req.params.id === null || req.params.id == '') {
            res.send(404);
            return false;
        }
        req.oid = req.params.id;
        delete req.params.id;
        return next();
    };


    this.del = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        console.log("Removing :" + req.oid);
        collection.remove({
                "_id": mongojs.ObjectId(req.oid)
            }, true,
            function (err, results) {
                if (err) res.send(500, err);
                else res.send(200, results);
            }
        );
        return next();
    }


    this.get = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        collection.findOne({
            _id: mongojs.ObjectId(req.oid)
        }, function (err, doc) {
            if (err) res.send(500, err);
            else res.send(doc);
        })
        return next();
    }

    this.post = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        collection.findAndModify({
            query: {
                _id: mongojs.ObjectId(req.oid)
            },
            update: {
                $set: req.body
            },
            new: true
        }, function (err, doc, lastErrorObject) {
            if (err) res.send(500, err);
            else res.send(200);
        })
        return next();
    }


}






module.exports = GenericRouteSingle;