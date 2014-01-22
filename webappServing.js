var fs = require('fs');
var express = require('express');

exports.createRoutes = function (app) {

    app.get("/index", function (req, res) {
        fs.readFile(__dirname + '/webapp/html/index.html', 'utf-8', function (err, data) {
            res.send(data);
        });
    });

}