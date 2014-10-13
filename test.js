// var redis = require("redis"),
// 	client = redis.createClient(1111 , "127.0.0.1");

// client.on("error", function (err) {
//     console.log("Error " + err);
// });

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });

// client.set("my_key" , "Zero" , function(err , reply){
// 	console.log(reply.toString());
// });

// client.get("my_key" , function(err , reply){
// 	console.log(reply.toString());
// });

var EventEmitter = require('events').EventEmitter;
var eve = new EventEmitter();

var async = require('async');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'anywhere',
  database : 'snz'
});

// var results;
// async.waterfall([
// 	function(callback){
// 		connection.connect();
// 		connection.query('select id from snz_requirements where status is null or status<=2' , function(err , requirements, callback){
// 			if (err) throw err;

// 			results = requirements;
// 			callback(null , results);
// 		});
// 		connection.end();
// 		console.log(results);	
// 	},
// 	function(){
// 		connection.connect();
// 		console.log("results->"+results);
// 		results.forEach(function(result){
// 			connection.query('SELECT requirement_id, count(*) as moduleNum, sum(total) as moduleTotal FROM snz_modules group by requirement_id;', function(err, rows, fields) {
// 			  if (err) throw err;
			  
// 			  rows.forEach(function(row) {
// 				console.log('The solution is: ', row['requirement_id'] , row['moduleNum'], row['moduleTotal']);
// 			  });
// 			});
// 		});
// 		connection.end();
// 	}], function (err, result) {
// 	    log('1.1 err: ', err);
// 	    log('1.1 result: ', result);
// 	}
// );

// var dumpCount = function(results){
// 	console.log(results);
// 	results.forEach(function(result){
// 		connection.query('SELECT requirement_id, count(*) as moduleNum, sum(total) as moduleTotal FROM snz_modules group by requirement_id;', function(err, rows, fields) {
// 		  if (err) throw err;
		  
// 		  rows.forEach(function(row) {
// 			console.log('The solution is: ', row['requirement_id'] , row['moduleNum'], row['moduleTotal']);
// 		  });
// 		});
// 	});
// }

// eve.on('dumpEvent', dumpCount);

// var query = function(){
// 	console.log('dumpEvent');
// 	var results;
// 	async.waterfall([
// 		function(){
// 			connection.query('select id from snz_requirements where status is null or status<=2' , function(err , requirements, fields){
// 				if (err) throw err;

// 				results = requirements;
// 				console.log("results->"+results);
// 			});
// 		},
// 		function(){
// 			return results;
// 		}
// 	])
// }
// eve.emit('dumpEvent' , query());

var results;
connection.connect();
connection.query('select id from snz_requirements where status is null or status<=2' , function(err , requirements, callback){
	if (err) throw err;

	console.log(requirements.length);
	requirements.forEach(function(result){
		connection.query('SELECT requirement_id, count(*) as moduleNum, sum(total) as moduleTotal FROM snz_modules where requirement_id='+result['id']+' group by requirement_id;', function(err, rows, fields) {
		  if (err) throw err;
		  
		  rows.forEach(function(row) {
			console.log('The solution is: ', row['requirement_id'] , row['moduleNum'], row['moduleTotal']);
		  });
		});
	});
	connection.end();
});

var redis = require("redis"),
	client = redis.createClient(1111 , "127.0.0.1");

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

client.set("my_key" , "Zero" , function(err , reply){
	console.log(reply.toString());
});

client.get("my_key" , function(err , reply){
	console.log(reply.toString());
});


