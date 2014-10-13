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
//更改需求的模块名称信息
connection.query('select id from snz_requirements' , function(err , requirement, callback){
	if (err) throw err;

	console.log(requirement.length);
	//写入每个需求的类目信息
	requirement.forEach(function(result){
		var id = result['id'];

		connection.query("select * from snz_req_predict_times where requirement_id="+id , function(err, rows, callback){
			
			if(rows.length == 0){
				connection.query("select * from snz_requirement_times where requirement_id="+id , function(err, times, callback){
					
					times.forEach(function(time){
						connection.query("insert into snz_req_predict_times(requirement_id, type, predict_start, predict_end, created_at, updated_at) values(? , ?, ?, ?, now(), now())", 
							[time["requirement_id"] , time["type"] , time["predict_start"] , time["predict_end"]], 
							function(err, texts, fields) {
						});
					});
				});
			}
		});
	});
	connection.end();
});
