var config = require('./info.json');

var async = require("async");
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config['mysql']['host'],
  user     : config['mysql']['user'],
  password : config['mysql']['pwd'],
  database : config['mysql']['db']
});

function selectHistory(req, callback) {
    connection.query('SELECT * FROM snz_requirement_solutions WHERE requirement_id=?', [req.id], function(err, solutionList) {
        if(err) return callback(err);
        
        var solutionS = {};
        solutionS[req.id] = solutionList;
        callback(null, solutionS);
    });
}

connection.query('SELECT * FROM snz_requirements', function(err, reqLists) {
    async.map(reqLists, selectHistory, function(err, solutionList) {
        console.log(solutionList);
    });

	connection.end();
});