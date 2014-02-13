/**
 * System
 */
var os = require('os')

console.log(os.platform());
exports.systemCtrl = function(app) {
    app.get('/api/system', function(req, res) {
        var message = {
            'stat': 'fail',
            'msg': ''
        }

        var system = {
            'hostname': os.hostname(),
            'platform': os.platform() + ' ' + os.release(),
            'totalmem': parseInt(os.totalmem() / 1000000,10),
            'usedmem': parseInt((os.totalmem() - os.freemem())/1000000, 10)
        }

        message = {
            'stat': 'ok',
            'info': system
        }
        res.send(200, message);

    });
};