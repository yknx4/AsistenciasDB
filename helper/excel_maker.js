var excelbuilder = require('msexcel-builder');
var http = require('http');


//getData(function(data){
//
//	console.log(data);
//	CreateWorkbookFromList("Kurabu","OtroSubtitle",data);
//});

var getFileStream = function (title, subtitle, data, callback) {
    var workbook = CreateWorkbookFromList(title, subtitle, data);
    //    console.log(workbook);
    //    console.log(title);
    //    console.log(subtitle);
    //    console.log(data);
    //    console.log(callback);
    
    //    workbook.save(function (err) {
    //        console.log('workbook saved ' + (err ? 'failed' : 'ok'));
    //    });

    workbook.generate(function (err, jszip) {
        console.log("generate");
        if (err) {
            console.log("error" + err);
            throw err;
        } else {
            console.log("got buffer");
            var buffer = jszip.generate({
                type: "nodebuffer"
            });
            callback(buffer);
        }

    });


//    workbook.generate(function (err, zip) {
//        var buffer;
//        buffer = zip.generate({
//            type: 'nodebuffer'
//        });
//        callback(buffer);
//    });
};

function CreateWorkbookFromList(title, subtitle, data) {

    // Create a new workbook file in current working-path
    var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')

    // Create a new worksheet with 10 columns and 12 rows
    var col = 3;
    var row = 4;
    row += data.length;

    var sheet1 = workbook.createSheet('ClubName', col, row);

    sheet1.width(1, 34);
    sheet1.width(2, 10);
    sheet1.width(3, 32);

    sheet1.merge({
        col: 1,
        row: 1
    }, {
        col: 3,
        row: 2
    });
    sheet1.font(1, 1, {
        name: 'Calibri',
        sz: '25',
        bold: true,
        iter: false
    });
    sheet1.merge({
        col: 1,
        row: 3
    }, {
        col: 3,
        row: 3
    });
    sheet1.font(1, 3, {
        name: 'Calibri',
        sz: '12',
        bold: false,
        iter: false
    });
    for (var i = 1; i <= 3; i++) {
        sheet1.font(i, 4, {
            name: 'Calibri',
            sz: '14',
            bold: false,
            iter: true
        });
    }

    sheet1.align(1, 1, 'center');
    sheet1.valign(1, 1, 'center');
    sheet1.align(1, 3, 'center');
    sheet1.align(2, 4, 'center');

    sheet1.set(1, 1, title);
    sheet1.set(1, 3, subtitle);
    sheet1.set(1, 4, 'Nombre');
    sheet1.set(2, 4, 'Cuenta');
    sheet1.set(3, 4, 'Plantel');

    for (var i = 0; i < data.length; i++) {
        var thisrow = i + 5;
        var c_student = data[i];
        //console.log(c_student);
        ///ALIGN
        sheet1.align(2, thisrow, 'center'); //Account in middle
        ////FONT
        sheet1.font(1, thisrow, {
            name: 'Calibri',
            sz: '11',
            bold: false,
            iter: false
        });
        sheet1.font(2, thisrow, {
            name: 'Calibri',
            sz: '11',
            bold: true,
            iter: false
        });
        sheet1.font(3, thisrow, {
            name: 'Calibri',
            sz: '11',
            bold: false,
            iter: false
        });
        ////Data
        sheet1.set(1, thisrow, c_student.name);
        sheet1.set(2, thisrow, c_student.account);
        sheet1.set(3, thisrow, c_student.school);

    }


    return workbook;

}

//function getData(callback) {
//
//	return http.get({
//		host: 'attendance-yknx4.rhcloud.com',
//		path: '/list?club=55ff10beac872d2442b57068&partial=1'
//	}, function(response) {
//		// Continuously update stream with data
//		var body = '';
//		response.on('data', function(d) {
//			body += d;
//		});
//		response.on('end', function() {
//
//			// Data reception is done, do whatever with it!
//			var parsed = JSON.parse(body);
//			callback(parsed);
//		});
//	});}
module.exports = getFileStream;