var config = require('./info.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var results;

console.log("fix snz_companies url.\n");
connection.connect();
//公司的各种文档的引用处理
connection.query('select id, business_license, org_cert, tax_no from snz_companies' , function(err , company, callback){
	if (err) throw err;

	console.log(company.length);

	var image = new RegExp('.jpg|.png|.PNG');

	//写入每个修改文件
	company.forEach(function(result){
		var id = result['id'];
		var license = result['business_license'];
		var org = result['org_cert'];
		var tax = result['tax_no'];

		var newLic;
		//判断是否是图片
		if(image.test(license)){
			newLic = license.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newLic = !license ? null : license.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		var newOrg;
		//判断是否是图片
		if(image.test(org)){
			newOrg = org.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newOrg = !org ? null : org.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		var newTax;
		//判断是否是图片
		if(image.test(tax)){
			newTax = tax.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newTax = !tax ? null : tax.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		console.log(id+":"+license);
		connection.query("update snz_companies set business_license=?, org_cert=?, tax_no=? where id=?", [newLic , newOrg, newTax, id], function(err, rows, fields) {
			if (err) console.log(err);
		});
	});
	connection.end();
});
