'use strict';

var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var Promise = require('bluebird');
var expect = chai.expect;
//chai.use(chaiAsPromised);
chai.expect(); //use expect to assert conditions
var _ = require('lodash');
var testConfig = require('./../testconfig');

//these will be ignored if
//describe('Salty Config', function () {
//
//
//  describe('.config', function () {
//    it('should load the default config from a settings.yml file', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var config = saltyConfig.config(testConfig.DEFAULT_CONFIG_FOR_TESTS);
//
//      expect(config.debug).to.be.true;
//
//    });
//    it('should load the default config file which has no common environment', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var config = saltyConfig.config(testConfig.CONFIG_NO_COMMON_ENV);
//
//      expect(config.debug).to.be.true;
//
//    });
//
//    it('should load a YAML config from a settings.yml file', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var config = saltyConfig.config('./../tests/config/settings-yaml.yml');
//
//      expect(config.debug).to.be.true;
//
//    });
//    it('should load a JSON config from a settings.json file', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var config = saltyConfig.config('./../tests/config/settings-json.json', {settingsFormat: 'json'});
//
//      expect(config.debug).to.be.true;
//
//
//    });
//    it('should load a config from an options object', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var config = saltyConfig.config({configFile: testConfig.DEFAULT_CONFIG_FOR_TESTS});
//
//      expect(config.debug).to.be.true;
//
//    });
//  });
//
//  describe('.seasonings', function () {
//    it('should load the seasonings from the config file', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml');
//
//      expect(seasonings.length).to.equal(2);
//      expect(seasonings[0]).to.equal('wd');
//
//    });
//    it('should load added seasonings from the init', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var seasonings = saltyConfig.seasonings('./../tests/config/settings-no-seasonings.yml', 'wd');
//
//      expect(seasonings.length).to.equal(1);
//      expect(seasonings[0]).to.equal('wd');
//
//    });
//    it('should combine the extra seasonings with default', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml', 'wd');
//
//      expect(seasonings.length).to.equal(2);
//
//    });
//  });
//
//  describe('.loadData', function () {
//
//    it('should throw proper error message (instead of ENOENT) when wrong file path is provided', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      return saltyConfig
//          .loadCsvData('tests/config/data-table-does-not-exist.csv')
//
//          .catch(function (err) {
//            expect(err).to.match(/Error: File not found. Please check your file path/);
//
//          });
//
//    });
//    it('should load list data from a csv into an array', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      return saltyConfig
//          .loadCsvData('tests/config/data-table.csv')
//          .then(function (datalist) {
//            expect(datalist).to.be.eql(
//                [
//                  ['name', 'place', 'animal', 'thing', 'when'],
//                  ['ken', 'kenya', 'kangaroo', 'kite', '12/02/15'],
//                  ['nige', 'nigeria', 'nightingale', 'nail', '13/02/15']
//                ]);
//
//          });
//
//    });
//    it('should load list data from a csv into an array skipping the headers', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      return saltyConfig
//          .loadCsvData('tests/config/data-table.csv', {skipHeaders: true})
//          .then(function (datalist) {
//            expect(datalist).to.be.eql(
//                [
//                  ['ken', 'kenya', 'kangaroo', 'kite', '12/02/15'],
//                  ['nige', 'nigeria', 'nightingale', 'nail', '13/02/15']]
//            );
//
//          });
//
//    });
//    it('should load list data from a csv into objects with header-based column names', function () {
//
//      var saltyConfig = require('./../../lib/config');
//
//      return saltyConfig
//          .loadCsvData('tests/config/data-table.csv', {columns: true})
//          .then(function (datalist) {
//            expect(datalist).to.be.eql(
//                [
//                  {'name': 'ken', 'place': 'kenya', 'animal': 'kangaroo', 'thing': 'kite', 'when': '12/02/15'},
//                  {'name': 'nige', 'place': 'nigeria', 'animal': 'nightingale', 'thing': 'nail', 'when': '13/02/15'}
//                ]
//            );
//          });
//
//    });
//
//
//    it('should load list data from a csv and format as table');
//
//  });
//
//  //describe.only('.data-driven tests', function () {
//  //
//  //});
//  //
//  //function datadrivenSuite(somedata){
//  //
//  //  //return function
//  //
//  //  //how to sync a promise ??? bad
//  //  //how to syncLoad the data ??? is this worst ?
//  //
//  //}
//
//  //describe.only('.data-driven tests', function () {
//  //
//  //  var saltyConfig = require('./../../lib/config');
//  //
//  //  var datalistb;
//  //
//  //  before(function () {
//  //    return saltyConfig
//  //        .loadCsvData('tests/config/data-table.csv', {columns: true})
//  //        .then(function (datalist) {
//  //          datalistb = datalist;
//  //          for (var i in datalist) {
//  //            var item = datalist[i];
//  //            console.log('....\n');
//  //            console.log('xx\n');
//  //            console.log(item);
//  //            console.log(it);
//  //            //blah(item.name, item.place, item.animal, item.thing);
//  //          }
//  //
//  //          return Promise.cast(datalist);
//  //
//  //        });
//  //  });
//  //
//  //  it('should load list data from a csv and run a data-driven test for name of dataset here ', function () {
//  //
//  //    var dataDrivenTests = function (some, piece, of, data) {
//  //
//  //      console.log('inside dataDrivenTests');
//  //
//  //      var xsome = some, xpiece = piece, xof = of, xdata = data;
//  //
//  //      console.log(['\t', some, piece, of, data].join(' '));
//  //      //it('should load list data from a csv and run a data-driven test for ' + [some, piece, of, data].join(' '), function () {
//  //      //  console.log('inside it');
//  //      //  console.log(context);
//  //      //
//  //      //  console.log(xsome, xpiece, xof, xdata);
//  //      //
//  //      //});
//  //
//  //      //choose different type of reporting. This is hard to setup anyway.
//  //
//  //
//  //    };
//  //
//  //
//  //    //dataDrivenTests('this', 'is', 'a', 'test.');
//  //    //dataDrivenTests('this', 'is', 'a', 'test2.');
//  //    //dataDrivenTests('this', 'is', 'a', 'test3.');
//  //
//  //
//  //    return saltyConfig
//  //        .loadCsvData('tests/config/data-table.csv', {columns: true})
//  //        .then(function (datalist) {
//  //
//  //          expect(datalist).to.be.eql(
//  //              [
//  //                {'name': 'ken', 'place': 'kenya', 'animal': 'kangaroo', 'thing': 'kite', 'when': '12/02/15'},
//  //                {'name': 'nige', 'place': 'nigeria', 'animal': 'nightingale', 'thing': 'nail', 'when': '13/02/15'}
//  //              ]
//  //          );
//  //
//  //          _.each(datalist, function (item) {
//  //            console.log('inside for each');
//  //            //option 1
//  //            dataDrivenTests('from _.each', item.place, item.animal, item.thing);
//  //
//  //          });
//  //
//  //          //done();
//  //
//  //
//  //        })
//  //        .bind(self);
//  //
//  //  });
//  //
//  //  var self = this;
//  //
//  //  var blah = function (some, piece, of, data) {
//  //
//  //    console.log(piece);
//  //    var xsome = some, xpiece = piece, xof = of, xdata = data;
//  //
//  //    console.log('>>>>>>');
//  //    console.log([some, piece, of, data].join(' '));
//  //
//  //    console.log(it);
//  //    var test = it('should load list data from a csv and run a data-driven test for ' + [some, piece, of, data].join(' '), function () {
//  //      console.log('miaow', xsome, xpiece, xof, xdata);
//  //      return 'boo';
//  //      throw new Error('blah.............................>>>>>>>>>>>>>>');
//  //    });
//  //
//  //    //self.tests.push(test);
//  //
//  //    console.log('....\n');
//  //
//  //  };
//  //
//  //  //saltyConfig
//  //  //   .loadCsvData('tests/config/data-table.csv', {columns: true})
//  //  //   .then(function (datalist) {
//  //  for (var i in datalistb) {
//  //    var item = datalistb[i];
//  //    console.log('....\n');
//  //    console.log('xx\n');
//  //    console.log(item);
//  //    console.log(it);
//  //    blah(item.name, item.place, item.animal, item.thing);
//  //  }
//  //  //})
//  //  //;//.bind(self);
//  //
//  //
//  //  it('noop', function () {
//  //  });
//  //
//  //});
//
//});


var datalistb;
var saltyConfig = require('./../../lib/config');


saltyConfig
      .loadCsvData('tests/config/data-table.csv', {columns: true})
      .then(function (datalist) {
        datalistb = datalist;
        for (var i in datalist) {
          var item = datalist[i];
          console.log('....\n');
          console.log('xx\n');
          console.log(item);
          console.log(it);
          //blah(item.name, item.place, item.animal, item.thing);
        }

        return Promise.cast(datalist);

      })
    .then( function(someting){
      setTimeout(function () {

        describe('Salty Config - for data-driven tests', function () {


          //describe.only('.data-driven tests', function () {
          //
          //});
          //
          //function datadrivenSuite(somedata){
          //
          //  //return function
          //
          //  //how to sync a promise ??? bad
          //  //how to syncLoad the data ??? is this worst ?
          //
          //}

          describe('.data-driven tests', function () {

            //var saltyConfig = require('./../../lib/config');
            //
            //var datalistb;
            //
            //before(function () {
            //  return saltyConfig
            //      .loadCsvData('tests/config/data-table.csv', {columns: true})
            //      .then(function (datalist) {
            //        datalistb = datalist;
            //        for (var i in datalist) {
            //          var item = datalist[i];
            //          console.log('....\n');
            //          console.log('xx\n');
            //          console.log(item);
            //          console.log(it);
            //          //blah(item.name, item.place, item.animal, item.thing);
            //        }
            //
            //        return Promise.cast(datalist);
            //
            //      });
            //});

            //it('should load list data from a csv and run a data-driven test for name of dataset here ', function () {
            //
            //  var dataDrivenTests = function (some, piece, of, data) {
            //
            //    console.log('inside dataDrivenTests');
            //
            //    var xsome = some, xpiece = piece, xof = of, xdata = data;
            //
            //    console.log(['\t', some, piece, of, data].join(' '));
            //    //it('should load list data from a csv and run a data-driven test for ' + [some, piece, of, data].join(' '), function () {
            //    //  console.log('inside it');
            //    //  console.log(context);
            //    //
            //    //  console.log(xsome, xpiece, xof, xdata);
            //    //
            //    //});
            //
            //    //choose different type of reporting. This is hard to setup anyway.
            //
            //
            //  };
            //
            //
            //  //dataDrivenTests('this', 'is', 'a', 'test.');
            //  //dataDrivenTests('this', 'is', 'a', 'test2.');
            //  //dataDrivenTests('this', 'is', 'a', 'test3.');
            //
            //
            //  return saltyConfig
            //      .loadCsvData('tests/config/data-table.csv', {columns: true})
            //      .then(function (datalist) {
            //
            //        expect(datalist).to.be.eql(
            //            [
            //              {'name': 'ken', 'place': 'kenya', 'animal': 'kangaroo', 'thing': 'kite', 'when': '12/02/15'},
            //              {'name': 'nige', 'place': 'nigeria', 'animal': 'nightingale', 'thing': 'nail', 'when': '13/02/15'}
            //            ]
            //        );
            //
            //        _.each(datalist, function (item) {
            //          console.log('inside for each');
            //          //option 1
            //          dataDrivenTests('from _.each', item.place, item.animal, item.thing);
            //
            //        });
            //
            //        //done();
            //
            //
            //      })
            //      .bind(self);
            //
            //});

            var self = this;

            var blah = function (some, piece, of, data) {

              console.log(piece);
              var xsome = some, xpiece = piece, xof = of, xdata = data;

              console.log('>>>>>>');
              console.log([some, piece, of, data].join(' '));

              console.log(it);
              var test = it('should load list data from a csv and run a data-driven test for ' + [some, piece, of, data].join(' '), function () {
                console.log('miaow', xsome, xpiece, xof, xdata);
                return 'boo';
                throw new Error('blah.............................>>>>>>>>>>>>>>');
              });

              //self.tests.push(test);

              console.log('....\n');

            };

            //saltyConfig
            //   .loadCsvData('tests/config/data-table.csv', {columns: true})
            //   .then(function (datalist) {
            for (var i in datalistb) {
              var item = datalistb[i];
              console.log('....\n');
              console.log('xx\n');
              console.log(item);
              console.log(it);
              blah(item.name, item.place, item.animal, item.thing);
            }
            //})
            //;//.bind(self);


            //it('noop', function () {});


          });


        });

        run();

      }, 2000);
    });


