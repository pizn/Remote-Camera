/**
 * All the routes
 */
var fs = require('fs');

exports.createRoutes = function (app) {
    app.get("/", function (req, res) {
        fs.readFile(__dirname + '/webapp/html/index.html', 'utf-8', function (err, data) {
            res.send(data);
        });
    });
}