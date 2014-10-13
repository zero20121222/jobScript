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

connection.query("select id,delivery_address from snz_requirements" , function(err , addressList, callBack){
	if (err) throw err;

	addressList.forEach(function(req){
		connection.query("select * from snz_modules where requirement_id=?", req["id"], function(err , module, callBack){
			if(module.length != 0){
				connection.query("select snz_address_factory.id from snz_module_factory,snz_address_factory where module_id=? and snz_address_factory.factory_num=snz_module_factory.factory_num", 
					module[0]["id"], function(err , moduleFacs, callBack){
					var reqFac = new Array(req["delivery_address"]);

					var modFac = new Array();

					moduleFacs.forEach(function(factory){
						modFac.push(factory["id"]);
					});

					console.log("-------------------------------");
					console.log("reqId->"+req["id"]);
					console.log("reqFac->"+reqFac);
					console.log("modFac->"+modFac);
				});
			}
		});
	});
});
