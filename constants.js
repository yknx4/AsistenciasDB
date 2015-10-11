module.exports = {
    secret: "vKl5zgWjjPmjkdfCas81iQtuXA75TXPFUUwcLCxRILHfNRhNWQ3oSG5jCVe2a7FXVCpzmNBeNRxeF7RXG0Oy8ZHtDY5I0IPwokLqi9YcNKbuGTjOc1rgTaRsCUerZFQVtX3l1jHNBIVl9vJf5EzjbZnt1imY62V5SGemUBcWqyOI79qnExd1m7byZL9OmC2Giohx5jMX",
    mongoConnectionString: function () {
        //provide a sensible default for local development
        //var db_string = 'mongodb://yknx4:konami941994@ds059722.mongolab.com:59722/attendance';
        var db_string = "mongodb://admin:VxTBY6e7ChgH@127.0.0.1:27017/attendance";
        //take advantage of openshift env vars when available:
        if (process.env.OPENSHIFT_MONGODB_DB_URL) {
            db_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'attendance';
        }
        return db_string;

    },
    array_contains: function (array, element) {
        return array.indexOf(element) > -1;
    },
    sort_by_name: function(a, b){
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
}

}
