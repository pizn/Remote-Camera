/**
 * The Remote Camera config file
 */

// Server port
exports.port = 3000;
exports.cookieSecret = "34a39cb01f43cb9463d656a3e2ec8b54";

// Rex
exports.emailRegex = new RegExp("^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$");

// Photo type
exports.piVedioPath = "/dev/video0";
exports.pictureXY = "320*240";
exports.picturePath = "/home/pi/tmp/";

// Email server
exports.email = "test@123.com";
exports.password = "111111";
exports.sentToMail = "youremail";

// Version
exports.version = "0.0.2";