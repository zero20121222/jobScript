var config = require('./info.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var results;

console.log("fix snz_company_finances");
//公司排名处理文档
connection.query('select id, open_license from snz_company_finances' , function(err , company, callback){
	if (err) throw err;

	console.log(company.length);

	var image = new RegExp('.jpg|.png|.PNG');

	//写入每个修改文件
	company.forEach(function(result){
		var id = result['id'];
		var openLicense = result['open_license'];

		var newOpenLicense;
		//判断是否是图片
		if(image.test(openLicense)){
			newOpenLicense = openLicense.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newOpenLicense = !openLicense ? null : openLicense.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		connection.query("update snz_company_finances set open_license=? where id=?", [newOpenLicense , id], function(err, rows, fields) {
			if (err) console.log(err);
		});
	});
	connection.end();
});
