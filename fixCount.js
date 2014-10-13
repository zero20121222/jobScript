/**
 * 修复各种统计数据信息
 * by MichaelZhao
 */

var config = require('./testDB.json');

var async = require("async");
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

var redis = require("redis"),
client = redis.createClient(config["redis"]["port"] , config["redis"]["host"]);

client.on("error", function (err) {
    console.log("Error " + err);
});

var reqPurKey = "reqCountByPurchaser:";
var reqCountKey = "reqInfoCountView:";
var solSupKey = "solCountBySupplier:";
var solCountKey = "supplierSolCount:";

var countV = {};
var countSupplier = {};
var countSol = {};
async.waterfall([
	function(query_cb) { 
        connection.query("select * from snz_requirements where status is not null;", function(err , reqList, callBack){
        	query_cb(null , reqList);
		});
    },
    function(reqList , count_cb){
    	var reqLength = reqList.length;

    	reqList.forEach(function(requirement){
			var reqId = requirement["id"];

			if(requirement["status"] || requirement["status"] == 0){
				var userCount = countV[requirement["creator_id"]];
				if(userCount){
					userCount[requirement["status"]+1]++;
				}else{
					userCount = new Array(0 , 0, 0, 0, 0, 0, 0, 0);

					userCount[requirement["status"]+1]++;
					
					countV[requirement["creator_id"]] = userCount;
				}
			}
			connection.query("select * from snz_requirement_solutions where requirement_id=?" , reqId, function(err , solList, callBack) {
				var answer_num = 0;
				var send_num = 0;

				/**
				 * MUTUAL_SOL("mutual_sol" , "交互过的需求数量"),
				 * ACCEPT_SOL("accept_sol" , "承诺的方案数量"),
				 * SELECT_SOL("select_sol" , "选中的方案数量"),
				 * ALTERNATE_SOL("alternate_sol", "备选的方案数量"),
				 * ENTER_SOL("enter_sol" , "入围的方案数量");
				 */
				//响应的供应商数量&提交方案的供应商数量
				solList.forEach(function(solution){
					if(requirement["status"]){
						var userCount = countSupplier[solution["user_id"]];
						var solCount = countSol[solution["user_id"]];
						if(userCount){
							userCount[requirement["status"]+1]++;
						}else{
							userCount = new Array(0 , 0, 0, 0, 0, 0, 0, 0);

							userCount[requirement["status"]+1]++;
							
							countSupplier[solution["user_id"]] = userCount;
						}

						if(solCount){
							countSolV(solution , solCount);
						}else{
							solCount = [0 , 0];

							countSol[solution["user_id"]] = solCount;

							countSolV(solution , solCount);
						}
					}

					//供应商响应数量
					answer_num++;

					//提交方案的供应商数量
					if(solution["solution_file"]){
						send_num++;
					}

				});

				//写入需求的模块和模块数量的统计
				client.hmset(reqCountKey+reqId , "answer_su", answer_num, "send_so", send_num);
			});

			console.log(reqLength--);
		});
		
		var interval = setInterval(function(){
			if(reqLength == 0){
				count_cb(null , null);
				clearInterval(interval);
			}
		}, 3);
    },
    function(value , callback){
    	console.log("send to redis");

		//写入供应商所参与需求的状态
		for(var key in countSupplier){
			for(var i=0; i<countSupplier[key].length; i++){
				client.hset(solSupKey+key , i-1, countSupplier[key][i]);
			}
			console.log((solSupKey+key)+"->> "+countSupplier[key]);
		}

		//写入供应商对应提交的方案的状态
		for(var key in countSol){
			client.hmset(solCountKey+key , "mutual_sol", countSol[key][0], "accept_sol", countSol[key][1]);
			console.log((solCountKey+key)+"->>"+countSol[key]);
		}

		//写入采购商的需求的统计信息
		var supKey = reqPurKey;
		for(var key in countV){
			for(var i=0; i<countV[key].length; i++){
				client.hset(reqPurKey+key , i-1, countV[key][i]);
			}
			console.log((reqPurKey+key)+"->> "+countV[key]);
		}
    }
], function(err , results){
	console.log(err);
	console.log("\n\n\n->>results->"+results);

	connection.end();
	client.quit();
});

/**
 * 供应商参与的需求的统计数据
 fix count
 	SEND_SU("send_su" , "推送的供应商数量"),
	ANSWER_SU("answer_su", "响应的供应商数量"),
	SEND_SO("send_so" , "提交方案的供应商数量"),
	TOPIC_NUM("topic_num" , "话题数");

 *  对应需求状态的数据统计
 fix count
 	DELETE(-1 , "已删除"),
    WAIT_SEND(0 , "等待发布"),
    RES_INTERACTIVE(1 , "需求交互"),
    RES_LOCK(2 , "需求锁定"),
    SOL_INTERACTIVE(3 , "方案交互|承诺底线"),
    SOL_END(4 , "方案终投|谈判|竞标"),
    SUP_SOL(5 , "选定供应商与方案"),
    TENDER_END(6 , "招标结束");
  */
// var reqPurKey = "reqCountByPurchaser:";
// var reqCountKey = "reqInfoCountView:";
// var solSupKey = "solCountBySupplier:";
// var solCountKey = "supplierSolCount:";
// connection.query("select * from snz_requirements where status is not null;", function(err , reqList, callBack){
	
// 	//seach as map
// 	var countV = {};
// 	var countSupplier = {};
// 	var countSol = {};
// 	reqList.forEach(function(requirement){
// 		var reqId = requirement["id"];

// 		if(requirement["status"] || requirement["status"] == 0){
// 			var userCount = countV[requirement["creator_id"]];
// 			if(userCount){
// 				userCount[requirement["status"]+1]++;
// 			}else{
// 				userCount = new Array(0 , 0, 0, 0, 0, 0, 0, 0);

// 				userCount[requirement["status"]+1]++;
				
// 				countV[requirement["creator_id"]] = userCount;
// 			}
// 		}
// 		connection.query("select * from snz_requirement_solutions where requirement_id=?" , reqId, function(err , solList, callBack) {
// 			var answer_num = 0;
// 			var send_num = 0;

// 			/**
// 			 * MUTUAL_SOL("mutual_sol" , "交互过的需求数量"),
// 			 * ACCEPT_SOL("accept_sol" , "承诺的方案数量"),
// 			 * SELECT_SOL("select_sol" , "选中的方案数量"),
// 			 * ALTERNATE_SOL("alternate_sol", "备选的方案数量"),
// 			 * ENTER_SOL("enter_sol" , "入围的方案数量");
// 			 */
// 			//响应的供应商数量&提交方案的供应商数量
// 			solList.forEach(function(solution){
// 				if(requirement["status"]){
// 					var userCount = countSupplier[solution["user_id"]];
// 					var solCount = countSol[solution["user_id"]];
// 					if(userCount){
// 						userCount[requirement["status"]+1]++;
// 					}else{
// 						userCount = new Array(0 , 0, 0, 0, 0, 0, 0, 0);

// 						userCount[requirement["status"]+1]++;
						
// 						countSupplier[solution["user_id"]] = userCount;
// 					}

// 					if(solCount){
// 						countSolV(solution , solCount);
// 					}else{
// 						solCount = [0 , 0];

// 						countSol[solution["user_id"]] = solCount;

// 						countSolV(solution , solCount);
// 					}
// 				}

// 				//供应商响应数量
// 				answer_num++;

// 				//提交方案的供应商数量
// 				if(solution["solution_file"]){
// 					send_num++;
// 				}
// 			});

// 			//写入供应商所参与需求的状态
// 			for(var key in countSupplier){
// 				for(var i=0; i<countSupplier[key].length; i++){
// 					client.hset(solSupKey+key , i-1, countSupplier[key][i]);
// 				}
// 				console.log("countSupplier->> "+countSupplier[key]);
// 			}

// 			//写入供应商对应提交的方案的状态
// 			for(var key in countSol){
// 				client.hmset(solCountKey+key , "mutual_sol", countSol[key][0], "accept_sol", countSol[key][1]);
// 				console.log((solCountKey+key)+"->>"+countSol[key]);
// 			}

// 			client.hmset(reqCountKey+reqId , "answer_su", answer_num, "send_so", send_num);
// 		});
// 	});

// 	//写入采购商的需求的统计信息
// 	var supKey = reqPurKey;
// 	for(var key in countV){
// 		for(var i=0; i<countV[key].length; i++){
// 			client.hset(reqPurKey+key , i-1, countV[key][i]);
// 		}
// 		console.log("countValue->> "+countV[key]);
// 	}

// 	connection.end();
// 	client.quit();
// });

function countSolV(sol , solCount){
	//交互过的需求数量
	solCount[0]++;
	
	//承诺的方案数量
	if(sol["status"] == 2 || sol["status"] > 3){
		solCount[1]++;
	}
}