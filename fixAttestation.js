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
connection.query('select id, technology from snz_module_solutions' , function(err , modules, callback){
	if (err) throw err;

	console.log(modules.length);
	//写入每个需求的统计数据
	modules.forEach(function(result){
		var technology;
		try{
			if(JSON.parse(result['technology'])){
				console.log(result['technology']);
			}
		}catch(error){
			console.log(error);
			if(result['technology'] == '无'){
				technology = "[{"+"\\"+"\"id\\"+"\":0, \\"+"\"name\\"+"\":\\"+"\"无\\"+"\"}]";

				connection.query("update snz_module_solutions set technology=\""+technology+"\" where id="+result['id'], function(err, rows, fields) {
				  if (err) throw err;
				});
			}else{
				technology = "[{"+"\\"+"\"id\\"+"\":1, \\"+"\"name\\"+"\":\\"+"\""+result['technology']+"\\"+"\"}]";

				connection.query("update snz_module_solutions set technology=\""+technology+"\" where id="+result['id'], function(err, rows, fields) {
				  if (err) throw err;
				});
			}
		}
	});
	connection.end();
});
