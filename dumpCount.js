var config = require('./testDB.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var redis = require("redis"),
client = redis.createClient(config['redis']['port'] , config['redis']['host']);

client.on("error", function (err) {
    console.log("Error " + err);
});

var setRedis = function(requirementId , moduleNum, moduleTotal){
	//写入模块的种类数量
	client.set("requirementId:"+requirementId+":moduleNum" , moduleNum, function(err , reply){
		if (err) throw err;

		console.log(reply.toString());
	});

	//写入模块的总体数据量
	client.set("requirementId:"+requirementId+":moduleTotal" , moduleTotal, function(err , reply){
		if (err) throw err;

		console.log(reply.toString());
	});
}

var results;
connection.connect();
//对需求阶段还未到需求锁定阶段的需求写入模块的统计数据
connection.query('select id from snz_requirements where status is null or status<=2' , function(err , requirements, callback){
	if (err) throw err;

	console.log(requirements.length);
	//写入每个需求的统计数据
	requirements.forEach(function(result){
		connection.query('SELECT requirement_id, count(*) as moduleNum, sum(total) as moduleTotal FROM snz_modules where requirement_id='+result['id']+' group by requirement_id;', function(err, rows, fields) {
		  if (err) throw err;
		  
		  rows.forEach(function(row) {
			console.log('The solution is: ', row['requirement_id'] , row['moduleNum'], row['moduleTotal']);
			//set to Redis
			setRedis(row['requirement_id'] , row['moduleNum'], row['moduleTotal']);
		  });
		});
	});
	connection.end();
});
