/*/products/*/


var defaults = require('../constants');
var db = GLOBAL.db;

function GenericRoute(name) {
    console.log("Route: " + name);
    this.route = '/' + name;
    var collection = db.collection(name);

    this.sort = function (req, res, next) {
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

    this.get = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        if (req.toSort) {
            collection.find().sort(req.sort_criteria, function (err, docs) {
                if (err) res.send(500, err);
                else res.send(docs);
            })
        } else {
            collection.find(function (err, docs) {
                if (err) res.send(500, err);
                else res.send(docs);
            });
        }
        return next();
    }
    this.post = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        collection.insert(req.body, function (err, resp) {
            if (err) res.send(500, err);
            else res.send(201, resp);
        })
        return next();
    }
}






module.exports = GenericRoute;