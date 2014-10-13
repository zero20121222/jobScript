var config = require('./testDB.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var results;

console.log("fix snz_company_ranks");
//公司排名处理文档
connection.query('select id, in_rank_file, out_rank_file from snz_company_ranks' , function(err , company, callback){
	if (err) throw err;

	console.log(company.length);

	var image = new RegExp('.jpg|.png|.PNG');

	//写入每个修改文件
	company.forEach(function(result){
		var id = result['id'];
		var inFile = result['in_rank_file'];
		var outFile = result['out_rank_file'];

		var newInFile;
		//判断是否是图片
		if(image.test(inFile)){
			newInFile = inFile.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newInFile = !inFile ? null : inFile.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		var newOutFile;
		//判断是否是图片
		if(image.test(outFile)){
			newOutFile = outFile.replace(/\/assets/ , "http://file.haier.com/images");
		}else{
			newOutFile = !outFile ? null : outFile.replace(/\/assets/ , "http://file.haier.com/docs");
		}

		connection.query("update snz_company_ranks set in_rank_file=?, out_rank_file=? where id=?", [newInFile , newOutFile, id], function(err, rows, fields) {
			if (err) console.log(err);
		});
	});
	connection.end();
});