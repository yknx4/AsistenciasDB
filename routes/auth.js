///sales/:id/abonar/:cantidad//

var defaults = require('../constants');
var routes_helper = require('../routes_helper');
var name = 'login';
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require('crypto');
var collection = GLOBAL.db.collection('user');
var tokens = GLOBAL.db.collection('token');

var route = {
    route: '/' + name
};

route.get = function(){return [function (req, res) {
    res.send(req.params);
}]};

route.protected = [];

var authFN = function (req, res) {

    // find the user
    collection.findOne({
        user: req.extras.user
    }, function (err, user) {

        if (err) throw err;
        //console.log(user);
        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            var hash = crypto.createHash('sha256').update(req.extras.password).digest('base64');
            console.log(hash);
            if (user.password != hash) {
                res.send({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                user.seed = Math.floor(Math.random() * 1000000000);
                delete user.password;
                var token = jwt.sign(user, defaults.secret);
                var id = 0;
                tokens.insert({
                        user: user._id,
                        valid: true,
                        token: token
                    }, function (err, resp) {
                        if (err) res.send(500, err);
                        id = resp._id;
                        res.send({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            token_id: id
                        });
                    })
                    // return the information including token as JSON

            }

        }

    });
}

route.post = function () {
    var pre = [routes_helper.check_param_function('user'),routes_helper.check_param_function('password')];
    var mid = [];
    if(route.protected.contains('post')){
        mid = mid.concat[routes_helper.check_token,routes_helper.check_master];
    }
    var fin = [authFN]
    return pre.concat(mid).concat(fin);
};


module.exports = route;