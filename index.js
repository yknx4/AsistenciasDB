//#!/usr/bin/env node
var cc          = require('config-multipaas');
var config      = cc();
var mongojs = require('mongojs');
var constants = require('./constants');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var storage = require('node-persist');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.get('PORT') || 3000);

/**
 * Create HTTP server.
 */
// TODO: Add Server
var db = mongojs(constants.mongoConnectionString());
console.log("Connecting to mongo on: "+constants.mongoConnectionString());
db.on('error', function (err) {
    console.log('database error', err)
})

db.on('ready', function () {
    console.log('database connected')
})
GLOBAL.db = db;


storage.initSync();

GLOBAL.storage = storage;


var server = require('./server');






/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is alreadyy in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    //  debug('Listening on ' + bind);
}

