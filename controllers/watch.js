/**
 * Watch.js
 */
var fs = require('fs');
var async = require('async');

exports.watchPhotosCtrl = function(app) {
    app.get('/api/photos', function(req, res) {
        var message = {
            'stat': 'deny'
        }
        if (!req.session.user) {
            var message = {
                'stat': 'deny'
            }
            res.send(200, message);
            return false;
        }
        fs.readdir('publish/photo', function (err, data) {
            if (err) {
                message = {
                    'stat': 'fail',
                    'msg': 'Error, could not read photos'
                }
                res.send(200, message);
                return false;
            }
            var photos = [], photo;
            async.forEachSeries(data, function(item, callback) {
                fs.stat('publish/photo/' + item, function (err, data) {
                    if(err) {
                        console.log('[error] File %s read stat error', item);
                    }
                    photo = {
                        'url': '/photo/'+item,
                        'name': item,
                        'size': data.size / 1000
                    }
                    photos.push(photo);
                    callback(null, item);
                });
            }, function(err) {
                if(err) {
                    message = {
                        'stat': 'fail',
                        'msg': 'Something is wrong'
                    }
                    console.log('[error] Read photos has error and stop');
                    res.send(200, message);
                    return false;
                }
                console.log('[info] Read photos finished');
                message = {
                    'stat': 'ok',
                    'photos': photos
                }
                res.send(200, message);
                return true;
            });
        });
    });

    app.delete('/api/photos/:name', function(req, res) {
        var message = {
            'stat': 'deny'
        }
        if(!req.params.name) {
            message = {
                'stat': 'fail',
                'msg': 'No photo name!'
            }
            res.send(200, message);
            return false;
        }
        if (!req.session.user) {
            var message = {
                'stat': 'deny'
            }
            res.send(200, message);
        }
        var photoPath = "publish/photo/" + req.params.name;
        console.log('[info] Photo %s will be delete', req.params.name);
        fs.unlink(photoPath, function(err) {
            if(err) {
                message = {
                    'stat': 'fail',
                    'msg': 'Could not delete!'
                }
                res.send(200, message);
                return false;
            }
            message = {
                'stat': 'ok'
            }
            res.send(200, message);
            return true;
        })
    })
}



