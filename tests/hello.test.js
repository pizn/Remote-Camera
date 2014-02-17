var Should = require('should');
var config = require('../config/config.js');


describe('config', function() {
    it('check port', function() {
        Should(config.port).be.a.Number;
    });
});