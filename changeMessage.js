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
connection.query('select id, content from snz_messages' , function(err , message, callback){
	if (err) throw err;

	console.log(message.length);
	//写入每个需求的类目信息
	message.forEach(function(result){
		var id = result['id'];
		var content = result['content'];

		var replaceValue = content.replace("demand_protocol" , "demand_detail");

		console.log(id+":"+content);
		connection.query("update snz_messages set content='"+replaceValue+"' where id="+id, function(err, rows, fields) {
			console.log(err);
		});
	});
	connection.end();
});
