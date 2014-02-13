/**
 * login.js
 */
var config = require('../config/config.js');

exports.doLoginCtrl = function(app) {

    /**
     *  doLogin
     */
    app.post("/api/login", function(req, res) {
        var email = req.param('email');
        var password = req.param('password');
        var message = {
            stat: "fail",
            msg: ""
        }

        if(req.session.user) {
            message = {
                stat: "ok",
                msg: "Already connected"
            }
            res.send(200, message);
            return true;
        }

        // Check type
        if (!email || !password || email.length < 3 || password.length < 3 || !email.match(config.emailRegex)) {
            message = {
                stat: "fail",
                msg: "Please provide a correct email and a correct password"
            }
            res.send(200, message);
            return false;
        }
        // Check user
        if( email !== config.username) {
            message = {
                stat: "fail",
                msg: "Error user"
            }
            res.send(200, message);
            return false;
        } else if(password !== config.userpwd) {
            message = {
                stat: "fail",
                msg: "Error password"
            }
            res.send(200, message);
        } else {
            message = {
                stat: "ok",
                msg: "Welcome"
            }
            req.session.user = email;
            console.log("[info] User %s connected", email);
            res.send(200, message);
        }

    });

    /**
     * doLogout
     */
    app.delete("/api/login", function (req, res) {
        var message = {
            'stat': 'fail',
            'msg': ''
        }
        if (!req.session.user) {
            message = {
                'stat': 'deny',
                'msg': 'You are not connected'
            }
            res.send(200, message);
            return false;
        }
        console.log("[info] User %s disconnect", req.session.user);
        delete req.session.user;
        message = {
            'stat': 'ok',
            'msg': 'Logout success'
        }
        res.send(200, message);
    });
};