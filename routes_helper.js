var defaults = require('./constants');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
    check_param_function: function (name) {
        return function (req, res, next) {
            if (typeof req.extras === "undefined") req.extras = {};
            if (req.params[name] === 'undefined' || req.params[name] === null || req.params[name] == '') {
                res.send(404);
                return false;
            }
            req.extras[name] = req.params[name];
            delete req.params[name];
            return next();
        }
    },

    check_id_function: function (req, res, next) {

        if (req.params.id === 'undefined' || req.params.id === null || req.params.id == '') {
            res.send(404);
            return false;
        }
        req.oid = req.params.id;
        delete req.params.id;
        return next();
    },
    check_token: function (req, res, next) {
       //console.log('Checking aut');
        // check header or url parameters or post parameters for token
        var token = req.params.token || req.headers['x-access-token'];
        //console.log(jwt);
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, defaults.secret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.send(403, {
                success: false,
                message: 'No token provided.'
            });

        }
    },
    check_master: function (req, res, next) {
        var master = req.decoded.master;
       // console.log(master);
        // decode token
        if (master) {
            console.log('Welcome Master '+req.decoded.name)
            next();
        } else {
            // if there is no token
            // return an error
            return res.send(403, {
                success: false,
                message: 'Permission Denied.'
            });

        }
    }


}