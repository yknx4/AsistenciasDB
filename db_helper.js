var db = GLOBAL.db;
var assert = require('assert');
module.exports = {
    insertDocument: function (object,collection,callback) {    
        collection.insert(object, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the restaurants collection.");
            callback(result);
        });
    }
}