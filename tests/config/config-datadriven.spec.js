'use strict';

var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var Promise = require('bluebird');
var expect = chai.expect;
//chai.use(chaiAsPromised);
chai.expect(); //use expect to assert conditions
var _ = require('lodash');
var testConfig = require('./../testconfig');


/**
 * Please note that this test requires
 * for describes to be in a callback function to be run
 * after the data has been loaded and the promise has resolved
 *
 */

var saltyConfig = require('./../../lib/config');
saltyConfig
    .loadCsvData('tests/config/data-table.csv', {columns: true})
    .then( function(datalist){

        describe('Salty Config - for data-driven tests', function () {


          describe('.data-driven tests', function () {


            var dataDrivenTest = function (some, piece, of, data) {


              var test = it('should load list data from a csv and run a data-driven test for ' + [some, piece, of, data].join(' '), function () {

                if(piece == 'kenya') {
                  expect([some, piece, of, data].join(' ')).to.equal('ken kenya kangaroo kite');
                } else {
                  expect([some, piece, of, data].join(' ')).to.equal('nige nigeria nightingale nail');
                }
              });

            };

            for (var i in datalist) {
              var item = datalist[i];
              dataDrivenTest(item.name, item.place, item.animal, item.thing);
            }


          });


        });

    });


