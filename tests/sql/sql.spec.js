'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.expect();
var testConfig = require('./../testconfig');
var sinon = require('sinon');
var _ = require('lodash');

describe('Salty SqlDriver', function () {

  describe('.config', function () {

    it('should connect to the db using mssql (default tedious driver)');

    it('should query the db using default dbConfig', function(){

      var saltyDuck = require('./../../index').init(testConfig.CONFIG_NO_SEASONINGS, 'db');

      expect(saltyDuck.db).to.be.a('function');

      var database = saltyDuck.db.getDb();

      database
          .query('select * from x')
          .catch(function(err){
            expect(err.name).to.be.equal('ConnectionError');
          });


      //for mysql => https://www.npmjs.com/package/mysql#piping-results-with-streams2
      //for pg => https://github.com/brianc/node-pg-query-stream

    });
    it('should insert records into the db', function(){

      var saltyDuck = require('./../../index').init(testConfig.CONFIG_NO_SEASONINGS, 'db');

      var database = saltyDuck.db.getDb();

      database
          .execute('insert into A ... ')
          .catch(function(err){
            expect(err.name).to.be.equal('ConnectionError');
          });


      //for mysql => https://www.npmjs.com/package/mysql#piping-results-with-streams2
      //for pg => https://github.com/brianc/node-pg-query-stream

    });
    it('should update records in the db');
    it('should delete records from the db');

    it('should bind the sql with params from a string', function(){

      var saltyDuck = require('./../../index').init(testConfig.CONFIG_NO_SEASONINGS, 'db');

      var database = saltyDuck.db.init();

      try {
        database
            .loadSqlObjects('/tests/sql/sometest.db.js')
            .SomeSpecialSqlStatement({some: 'params', go: 'here'})
            .then(function (recordset) {

            });
      } catch (e) {
        expect(e.message).to.be.equal("Cannot read property 'SomeSpecialSqlStatement' of undefined")
      }

      try {
        var sqlObjects = database
            .loadSqlObjects('/tests/sql/sometest.db.js')// ?? is this like stored procs ? or object faces
            .select('')//can we use node-sql instead, then use the provided
            .where('');
      } catch (e) {
        expect(e.message).to.be.equal("Cannot read property 'select' of undefined")
        //todo:[kj] impleent this
      }

    });
    it('should bind the sql with params from an array');
    it('should bind the sql with params from an object');

  });

});
