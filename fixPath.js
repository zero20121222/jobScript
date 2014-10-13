var config = require('./newDB.json');

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config['mysql']['host'],
	user     : config['mysql']['user'],
	password : config['mysql']['pwd'],
	database : config['mysql']['db']
});

var results;

console.log("fix file path");
var paramArgus = process.argv.splice(2);

var table;
var querySql = "select ";
for(var i=0; i<paramArgus.length; i++){
	if(i == paramArgus.length-1){
		querySql += " from "+paramArgus[i]+";";
		table = paramArgus[i];
	}else {
		querySql += (i == paramArgus.length-2 ? paramArgus[i] : paramArgus[i]+", ");
	}
}


var updateSql = "update " + table + " set ";
for(var i=1; i<paramArgus.length-1; i++){
	updateSql += i == paramArgus.length-2 ? paramArgus[i]+"=? " : paramArgus[i]+"=?, ";
}
updateSql += " where id=?"

// console.log("updateSql->"+updateSql);
// console.log("querySql->"+querySql);

//公司排名处理文档
connection.query(querySql , function(err , company, callback){
	if (err) throw err;

	console.log(company.length);

	var image = new RegExp('jpg|png|PNG|JPG$');
	var old = new RegExp('/2014/09/24/');

	//写入每个修改文件
	company.forEach(function(resJson){
		var result = [];

		for(var i=0; i<paramArgus.length-1; i++){
			result.push(resJson[paramArgus[i]]);
		}

		console.log(result);

		var id;
		var arrayBuffer = new Array();
		var i=0;
		for(i=0; i<result.length; i++){
			if(i == 0){
				id = result[i]
			}else{
				// //判断是否是图片
				// if(image.test(result[i])){
				// 	// if(old.test(result[i])){
				// 	// 	var splitV = result[i].split("/");
				// 	// 	arrayBuffer[i-1] = "http://wj.ihaier.com/images/2014/09/24/"+splitV[splitV.length-1];
				// 	// }else{
				// 	// 	arrayBuffer[i-1] = result[i].replace(/http:\/\/ladmin\.ihaier\.com/g , "").replace(/http:\/\/l\.ihaier\.com/g , "").replace(/\/assets/g , "http://wj.ihaier.com/images");
				// 	// }
				// 	arrayBuffer[i-1] = result[i];
				// }else{
				// 	if(old.test(result[i])){
				// 		var splitV = result[i].split("/");
				// 		arrayBuffer[i-1] = "http://wj.ihaier.com/docs/2014/09/24/"+splitV[splitV.length-1];
				// 	}else{
				// 		arrayBuffer[i-1] = result[i];
				// 	}
				// 	// }else{
				// 	// 	arrayBuffer[i-1] = !result[i] ? null : result[i].replace(/http:\/\/ladmin\.ihaier\.com/g , "").replace(/http:\/\/l\.ihaier\.com/g  , "").replace(/\/assets/g , "http://wj.ihaier.com/docs");
				// 	// }
				// }
				arrayBuffer[i-1] = !result[i] ? null : result[i].replace(/http:\/\/wj\.ihaier\.com:8080:8080/g , "http://wj.ihaier.com:8080");
			}
		}
		arrayBuffer[i-1] = id;
		// console.log("arrayBuffer->"+arrayBuffer);

		connection.query(updateSql , arrayBuffer, function(err, rows, fields) {
			if (err) console.log(err);
		});
	});
connection.end();
});
