/*/products/*/
var db = GLOBAL.db;
var mongojs = require('mongojs');
var defaults = require('../constants');
var routes_helper = require('../routes_helper');

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
                else res.send(200, results);
            }
        );
        return next();
    }
    this.del = function () {
        var pre = [routes_helper.check_token];
        var mid = [];
        if (this.protected.contains('del')) {
            mid = mid.concat([routes_helper.check_master]);
        }
        var fin = [delFN];
        return pre.concat(mid).concat(fin);
    };


    var getFN = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        collection.findOne({
            _id: mongojs.ObjectId(req.oid)
        }, function (err, doc) {
            if (err) res.send(500, err);
            else res.send(doc);
        })
        return next();
    }


    this.get = function () {
        var pre = [check_id];
        var mid = [];
        if (this.protected.contains('get')) {
            mid = mid.concat([routes_helper.check_token, routes_helper.check_master]);
        }
        var fin = [getFN];
        return pre.concat(mid).concat(fin);
    };


    var postFN = function (req, res, next) {
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
    this.post = function () {
        var pre = [routes_helper.check_token, check_id];
        var mid = [];
        if (this.protected.contains('post')) {
            mid = mid.concat([routes_helper.check_master]);
        }
        var fin = [postFN];
        return pre.concat(mid).concat(fin);
    };

}






module.exports = GenericRouteSingle;