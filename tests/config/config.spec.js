'use strict';

var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
//chai.use(chaiAsPromised);
//chai.expect(); //use expect to assert conditions
var _ = require('lodash');
var testConfig = require('./../testconfig');


describe('Salty Config', function () {


  describe('.config', function () {
    it('should be part of the default saltyDuck', function(){

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS);

      expect(saltyDuck.config).to.be.a('function');

    });

    it('should load the default config from a settings.yml file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      expect(config.debug).to.be.true;

    });
    it('should load the default config file which has no common environment', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config(testConfig.CONFIG_NO_COMMON_ENV);

      expect(config.debug).to.be.true;

    });

    it('should load a YAML config from a settings.yml file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config('./../tests/config/settings-yaml.yml');

      expect(config.debug).to.be.true;

    });
    it('should load a JSON config from a settings.json file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config('./../tests/config/settings-json.json', {settingsFormat: 'json'});

      expect(config.debug).to.be.true;


    });
    it('should load a config from an options object', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config({configFile: testConfig.DEFAULT_CONFIG_FOR_TESTS});

      expect(config.debug).to.be.true;

    });
  });

  describe('.seasonings', function () {
    it('should be part of the default saltyDuck', function(){

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS);

      expect(saltyDuck.addSeasoning).to.be.a('function');

    });

    it('should load the seasonings from the config file', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml');

      expect(seasonings.length).to.equal(4);
      expect(seasonings[0]).to.eql({name:'webdriver', location: 'webdriver'}); //handles hint (eg. mssql, webdriver) and converts to full format
      expect(seasonings[1]).to.eql({name:'api', location: 'api'});
      expect(seasonings[2]).to.eql({name:'db', location: 'db'});
      expect(seasonings[3]).to.eql({name:'one', location: './my/special/one'}); //handles custom config

    });
    it('should load added seasonings from the init with a hint as param', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings-no-seasonings.yml', 'wd');

      expect(seasonings.length).to.equal(1);
      expect(seasonings[0]).to.eql({name:'wd', location: 'wd'}); //handles namespace : hint || path format

    });
    it('should load added seasonings from the init with a config item array as param', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings-no-seasonings.yml',
          [
            { name: 'somename', location: './some/seasoning' },
            { name: 'one', location: './my/special/one' },
            './my/special/two',
            'three'
          ]);

      expect(seasonings.length).to.equal(4);
      expect(seasonings[0]).to.eql({name:'somename', location: './some/seasoning'}); //handles namespace : hint || path format
      expect(seasonings[1]).to.eql({name:'one', location: './my/special/one'}); //handles namespace : hint || path format
      //expect(seasonings[2]).to.eql({name:'two', location: './my/special/two'}); //handles namespace : hint || path format
      expect(seasonings[3]).to.eql({name:'three', location: 'three'}); //handles namespace : hint || path format

    });

    it('should override the default with extra seasonings', function () {

      var saltyConfig = require('./../../lib/config');
      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml', [ {name:'webdriver', location: './some/other/webdriver'} ]);

      console.log(seasonings);

      expect(seasonings.length).to.equal(4);

    });
  });

  describe('.loadData', function () {


    it('should be part of the default saltyDuck', function(){

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS);

      expect(saltyDuck.loadCsvData).to.be.a('function');

    });

    it('should throw proper error message (instead of ENOENT) when wrong file path is provided', function () {

      var saltyConfig = require('./../../lib/config');

      return saltyConfig
          .loadCsvData('tests/config/data-table-does-not-exist.csv')
          .catch(function (err) {
            expect(err).to.match(/Error: File not found. Please check your file path/);

          });

    });
    it('should load list data from a csv into an array', function () {

      var saltyConfig = require('./../../lib/config');

      return saltyConfig
          .loadCsvData('tests/config/data-table.csv')
          .then(function (datalist) {
            expect(datalist).to.be.eql(
                [
                  ['name', 'place', 'animal', 'thing', 'when'],
                  ['ken', 'kenya', 'kangaroo', 'kite', '12/02/15'],
                  ['nige', 'nigeria', 'nightingale', 'nail', '13/02/15']
                ]);

          });

    });
    it('should load list data from a csv into an array skipping the headers', function () {

      var saltyConfig = require('./../../lib/config');

      return saltyConfig
          .loadCsvData('tests/config/data-table.csv', {skipHeaders: true})
          .then(function (datalist) {
            expect(datalist).to.be.eql(
                [
                  ['ken', 'kenya', 'kangaroo', 'kite', '12/02/15'],
                  ['nige', 'nigeria', 'nightingale', 'nail', '13/02/15']]
            );

          });

    });
    it('should load list data from a csv into objects with header-based column names', function () {

      var saltyConfig = require('./../../lib/config');

      return saltyConfig
          .loadCsvData('tests/config/data-table.csv', {columns: true})
          .then(function (datalist) {
            expect(datalist).to.be.eql(
                [
                  {'name': 'ken', 'place': 'kenya', 'animal': 'kangaroo', 'thing': 'kite', 'when': '12/02/15'},
                  {'name': 'nige', 'place': 'nigeria', 'animal': 'nightingale', 'thing': 'nail', 'when': '13/02/15'}
                ]
            );
          });

    });


    //it('should load list data from a csv and format as table');

  });


});


