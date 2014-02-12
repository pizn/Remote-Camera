/**
 * All the routes
 */
exports.createRoutes = function (app) {
    app.get("/", function (req, res) {
        var alreadyLogged;
        if(req.session.user) {
            alreadyLogged = true;
        } else {
            alreadyLogged = false;
        }
        res.render('index', {
            alreadyLogged: alreadyLogged
        });
    });
}