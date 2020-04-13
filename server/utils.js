const fs = require("fs");
var util = require('util');
let log_file = fs.createWriteStream(__dirname + '/serverLog.txt', {flags : 'a'});
module.exports.logger = function (...args) {
	var myTime = new Date();
	myTime = myTime.toString().split("GMT")[0];
	log_file.write("\n====" + myTime + "====\n");
	args.forEach(function(element){
	   log_file.write(util.format(element) + '\n');
	});
};

module.exports.isEmptyObject = function(obj) {
	return !Object.keys(obj).length;
}