// Required module references.
var stream = require("stream");
var chalk = require("chalk");
var util = require("util");
var http = require("http");
var fileSystem = require("fs");


// ---------------------------------------------------------- //
// ---------------------------------------------------------- //


// I turn the given source Buffer into a Readable stream.
function BufferStream(source) {

    if (!Buffer.isBuffer(source)) {

        throw (new Error("Source must be a buffer."));

    }

    // Super constructor.
    stream.Readable.call(this);

    this._source = source;

    // I keep track of which portion of the source buffer is currently being pushed
    // onto the internal stream buffer during read actions.
    this._offset = 0;
    this._length = source.length;

    // When the stream has ended, try to clean up the memory references.
    this.on("end", this._destroy);

}

util.inherits(BufferStream, stream.Readable);


// I attempt to clean up variable references once the stream has been ended.
// --
// NOTE: I am not sure this is necessary. But, I'm trying to be more cognizant of memory
// usage since my Node.js apps will (eventually) never restart.
BufferStream.prototype._destroy = function () {

    this._source = null;
    this._offset = null;
    this._length = null;

};


// I read chunks from the source buffer into the underlying stream buffer.
// --
// NOTE: We can assume the size value will always be available since we are not
// altering the readable state options when initializing the Readable stream.
BufferStream.prototype._read = function (size) {

    // If we haven't reached the end of the source buffer, push the next chunk onto
    // the internal stream buffer.
    if (this._offset < this._length) {

        this.push(this._source.slice(this._offset, (this._offset + size)));

        this._offset += size;

    }

    // If we've consumed the entire source buffer, close the readable stream.
    if (this._offset >= this._length) {

        this.push(null);

    }

};




///////////////////////////////////////////
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

function sendRes(res, userTotal, current) {


}


var getFN = function (req, res) {
    var poke = 0;
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
                            console.log(user.name + " : " + att.length)
                            user.attendances = att;
                            result.push(user);
                            //console.log(result);
                        }
                        poke++;
                        //console.log("Poked: " + poke);
                        //if(att.length>0)console.log(att.length);
                        if (poke == (users.length - 1)) {
                            var sortedResult = result.sort(defaults.sort_by_name);
                            if (req.params.excel) {
                                var filename = "list.xlsx";
                                var excel = require('../helper/excel_maker');
                                console.log(excel);
                                excel("Club", "Subtitle", sortedResult, function (buff) {
                                    //console.log(buff);

                                    console.log("preheader");
                                    res.header('Content-disposition', 'inline; filename="' + filename + '"');
                                    res.header('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                    var stream = new BufferStream(buff);
                                    //console.log(stream);
//                                    for (bar in stream) {
//                                        console.log("Foo has property " + bar);
//                                    }
                                    stream.pipe(res);
                                    //buff.pipe(res);
                                });
                            } else {
                                res.json(sortedResult);
                            }
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