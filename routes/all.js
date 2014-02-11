/**
 * All the routes
 */
var fs = require('fs');

exports.createRoutes = function (app) {
    console.log('123');
    app.get("/", function (req, res) {
        res.render('index', { /* template locals context */ });

//        console.log('111');
//        fs.readFile('webapp/html/index.html', 'utf-8', function (err, data) {
//            res.send(data);
//        });
    });
}