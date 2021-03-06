  /*/products/*/


var defaults = require('../constants');
var db = GLOBAL.db;
var routes_helper = require('../routes_helper');

function GenericRoute(name) {
    //console.log("Route: " + name);
    this.protected = [];
    this.route = '/' + name;
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
        var hidePasswordProjection = {password:0};
        if(req.decoded) hidePasswordProjection = {};
        console.log(JSON.stringify(req.params));
        if (req.toSort) {
            collection.find(req.params,hidePasswordProjection).sort(req.sort_criteria, function (err, docs) {
                if (err) res.send(500, err);
                else res.send(docs);
            })
        } else {
            collection.find(req.params,hidePasswordProjection,function (err, docs) {
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
        var fin = [sort,getFn];
        return pre.concat(mid).concat(fin);
    };

    var postFN = function (req, res, next) {
        res.set('content-type', 'application/json; charset=utf-8');
        collection.insert(req.body, function (err, resp) {
            if (err) res.send(500, err);
            else res.send(201, resp);
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