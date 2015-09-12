'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.expect(); //use expect to assert conditions
var testConfig = require('./../testconfig');
var sinon = require('sinon');
var _ = require('lodash');

describe('Salty SqlDriver', function () {

  describe('.config', function () {

    it('should connect to the db using mssql (default tedious driver)');

    it('should query the db');
    it('should insert records into the db');
    it('should update records int the db');
    it('should delete records from the db');

    it('should bind the sql with params from a string', function(){

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'sql');

      var sqlObjects =  saltyDuck
          .loadSqlObjects('/tests/sql/sometest.sql.js')
          .select('').where('');

      var sqlObjects =  saltyDuck
          .loadSqlObjects('/tests/sql/sometest.sql.js')
          .select('').where('');


    });
    it('should bind the sql with params from an array');
    it('should bind the sql with params from an object');

  });

});
