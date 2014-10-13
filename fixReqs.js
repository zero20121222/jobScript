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
connection.query('select id, materiel_type from snz_requirements' , function(err , requirement, callback){
	if (err) throw err;

	console.log(requirement.length);
	//写入每个需求的类目信息
	requirement.forEach(function(result){
		var id = result['id'];
		var materielType = result['materiel_type'];

		console.log(id+":"+materielType);

		connection.query("select id, name from snz_backend_categorys where id="+materielType , function(err, rows, callback){
			console.log(rows);
			rows.forEach(function(category){
				connection.query("update snz_requirements set materiel_name='"+category['name']+"' where id="+id, function(err, rows, fields) {
					console.log(err);
				});
			});
		});
	});
});
