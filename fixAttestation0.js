var config = require('./info.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var results;
connection.connect();
//对需求阶段还未到需求锁定阶段的需求写入模块的统计数据
connection.query('select id, attestations from snz_modules' , function(err , modules, callback){
	if (err) throw err;

	console.log(modules.length);
	//写入每个需求的统计数据
	modules.forEach(function(result){
		var attestations = result['attestations'];

		console.log(attestations);
		var replaceValue = attestations.replace(/\"/g , "\\"+"\"").replace(/\'/g , "\\"+"\"");
		console.log(replaceValue);

		connection.query("update snz_modules set attestations=\""+replaceValue+"\" where id="+result['id'], function(err, rows, fields) {
		  console.log(err);
		});
	});
	connection.end();
});
