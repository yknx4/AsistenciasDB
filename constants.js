module.exports = {
    mongoConnectionString: function () {
        //provide a sensible default for local development
        var db_string = 'mongodb://yknx4:konami941994@ds059722.mongolab.com:59722/attendance';
        //take advantage of openshift env vars when available:
        if (process.env.OPENSHIFT_MONGODB_DB_URL) {
            //mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
            db_string = 'mongodb://admin:_wZNQDlvA-EX@'+process.env.OPENSHIFT_MONGODB_DB_URL + 'attendance';
        }
        return db_string;

    }
}