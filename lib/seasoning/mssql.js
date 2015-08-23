/**
 * class SaltyMsSql
 *
 * Handles helper with MsSql calls for functional data validations.
 **/

"use strict";

var _ = require('lodash');
var Salty = require('./../salty').instance;
var sql = require('mssql');

var SaltyMsSql = module.exports = function SaltyMsSql(options) {
  return this;
};


//todo:[kj] construct as normal class
SaltyMsSql = _.assign(SaltyMsSql, {


  //====== sql seasoning =================================================
  doSqlQuery: function (sqlQuery, dbConfig) {
    //console.log(("Executing SQL: " + sqlQuery));

    //todo: [kj] extract config
    if (!dbConfig) {
      throw new Error('dbConfig not provided for environment.');
    }

    var connection = new sql.Connection(dbConfig);
    return connection
        .connect()
        .then(function() {
          var request = new sql.Request(connection);
          return request
              .query(sqlQuery)
              .then(function(recordset){
                if(recordset) {
                  connection.close();
                  return recordset;
                }
              })
              .catch(function(err){
                if(err) {
                  connection.close();
                  throw err;
                }
              });

        })
        .catch(function(err){
          if(err){
            console.log("Error in Sql Connection");
            connection.close();
            throw err;
          }
        });

  },

});

SaltyMsSql.NAME = 'mssql';
SaltyMsSql.DESCRIPTION = 'MsSql helper (npm > mssql)';
SaltyMsSql.VERSION = '0.0.1';
