'use strict';

var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
//chai.use(chaiAsPromised);
chai.expect(); //use expect to assert conditions
var testConfig = require('./../testconfig');

describe('Salty Config', function () {


  describe('.config', function () {
    it('should load the default config from a settings.yml file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      expect(config.debug).to.be.true;

    });
    it('should load a YAML config from a settings.yml file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config('./../tests/config/settings-yaml.yml');

      expect(config.debug).to.be.true;

    });
    it('should load a JSON config from a settings.json file', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config('./../tests/config/settings-json.json', { settingsFormat:'json' });

      expect(config.debug).to.be.true;


    });
    it('should load a config from an options object', function () {

      var saltyConfig = require('./../../lib/config');

      var config = saltyConfig.config({configFile:testConfig.DEFAULT_CONFIG_FOR_TESTS});

      expect(config.debug).to.be.true;

    });
  });
  describe('.seasonings', function () {
    it('should load the seasonings from the config file', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml');

      expect(seasonings.length).to.equal(2);
      expect(seasonings[0]).to.equal('wd');

    });
    it('should load added seasonings from the init', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings-no-seasonings.yml', 'wd');

      expect(seasonings.length).to.equal(1);
      expect(seasonings[0]).to.equal('wd');

    });
    it('should combine the extra seasonings with default', function () {

      var saltyConfig = require('./../../lib/config');

      var seasonings = saltyConfig.seasonings('./../tests/config/settings.yml', 'wd');

      expect(seasonings.length).to.equal(2);

    });
  });

});
