///sales/:id/abonar/:cantidad//

var defaults = require('../constants');
var routes_helper = require('../routes_helper');
var name = 'list';
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require('crypto');
var studentCollection = GLOBAL.db.collection('student');
var attendanceCollection = GLOBAL.db.collection('attendance');
var mongojs = require('mongojs');

var route = {
    route: '/' + name
};

route.protected = [];

var getFN = function (req, res) {
    var result = new Array();
    var query = {
        club_id: req.extras.club,
        partial: parseInt(req.extras.partial),
        student_id: 0
    };
    console.log("Getting list for :" + query.club_id + " (" + query.partial + ")");
    // find the user
    studentCollection.find({}, function (err, users) {
            if (err) throw err;
            users.forEach(function (user) {
                //console.log(user);
                query.student_id = user._id + '';
                //console.log(JSON.stringify(query));
                attendanceCollection.find(query, function (err, att) {

                        if (err) throw err;
                        if (att.length > 0) {
                            console.log(att.length)
                            user.attendances = att;
                            result.push(user);
                            console.log(result);
                        }
                        //if(att.length>0)console.log(att.length);
                        if(users.indexOf(user) == (users.length-1)){
                            res.send(result.sort(function(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}));
                        }
                    }

                );

            });


        }

    );

}

route.get = function () {
    var pre = [routes_helper.check_param_function('club'), routes_helper.check_param_function('partial')];
    var mid = [];
    if (route.protected.contains('get')) {
        mid = mid.concat[routes_helper.enforce_login, routes_helper.check_master];
    }
    var fin = [getFN]
    return pre.concat(mid).concat(fin);
};


module.exports = route;
