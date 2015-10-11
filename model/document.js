/*/products/*/
var db = GLOBAL.db;
var mongojs = require('mongojs');
var defaults = require('../constants');
var routes_helper = require('../routes_helper');
var storage = GLOBAL.storage;

function GenericRouteSingle(name) {
    //console.log("Document Route: " + name);
    this.route = '/' + name + '/:id';
    var collection = db.collection(name);
    this.protected = [];
    var check_id = routes_helper.check_id_function;


    var delFN = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        console.log("Removing :" + req.oid);
        collection.remove({
                "_id": mongojs.ObjectId(req.oid)
            }, true,
            function (err, results) {
                if (err) res.send(500, err);
                else {
                    storage.setItem(name, new Date());
                    res.send(200, results);
                }
            }
        );
        return next();
    }
    this.del = function () {
        var pre = [check_id, routes_helper.enforce_login];
        var mid = [];
        if (this.protected.contains('del')) {
            mid = mid.concat([routes_helper.check_master]);
        }
        var fin = [delFN];
        return pre.concat(mid).concat(fin);
    };


    var getFN = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        console.log("Get request");

         var lastModif = storage.getItem(name);
        console.log("Stored " + lastModif);
        if (!lastModif) {
            lastModif = new Date().toString();
            storage.setItem(name,lastModif);
        }
        console.log('Last modified: ' + lastModif);
        res.header('Last-Modified', lastModif);
        res.header('Date', new Date().toString());
        console.log("Date :" + new Date().toString());

        var hidePasswordProjection = {
            password: 0
        };
        if (req.decoded) hidePasswordProjection = {};
        collection.findOne({
            _id: mongojs.ObjectId(req.oid)
        }, hidePasswordProjection, function (err, doc) {
            if (err) res.send(500, err);
            else res.send(doc);
        })
        return next();
    }


    this.get = function () {
        var pre = [check_id];
        var mid = [];
        if (this.protected.contains('get')) {
            mid = mid.concat([routes_helper.enforce_login, routes_helper.check_master]);
        }
        var fin = [getFN];
        return pre.concat(mid).concat(fin);
    };


    var putFN = function (req, res, next) {
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
            else {
                storage.setItem(name, new Date().toString());
                res.send(200);
            }
        })
        return next();
    }
    
    this.put = function () {
        var pre = [routes_helper.enforce_login, check_id];
        var mid = [];
        if (this.protected.contains('put')) {
            mid = mid.concat([routes_helper.check_master]);
        }
        var fin = [putFN];
        return pre.concat(mid).concat(fin);
    };

}






module.exports = GenericRouteSingle;