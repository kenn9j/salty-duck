/**
 * class SaltyConfig
 *
 * Handles helper config loading and parsing. Supports YAML and JSON.
 *
 * #### Formats
 * - YAML (default is `settings.yml` in the root of your app)
 * - JSON
 *
 * #### Why is YAML the default?
 * Configs accommodate variation by environment. Environment configs are often handled by ops engineers who may not use javascript or even JSON regularly. YAML is much easier to read format, easier to diff and more python/ruby-like. Using YAML makes life easier for them.
 *
 * #### How to use JSON format instead of YAML?
 * When salting the duck do `saltyduck.init({ settingsFormat:'json',... }, ..);`
 *
 **/
'use strict';

var _ = require('lodash');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var _configSettings;

var DEFAULT_CONFIG_FILEPATH = './../../../settings.yml';

var SaltyConfig = module.exports = new function SaltyConfig() {
  return this;
};

/**
 *  SaltyConfig.config(configFile [optional], overrideOptions [optional]) -> Object
 *  - configFile (string): Relative path of `settings.yml` or `settings.json` file. This defaults to `'./../../../settings.yml'`
 *  - overrideOptions (Object): Object of overridable properties //todo: [kj] design TBC overridable properties
 *
 *  Returns merged effective environment config based on provided process.env modifier. Defaults to config > environment > development
 *
 *  Please refrain from adding Test data variables in the config.
 *
 *  #### Options
 *
 *  If you provide no params, it will return a default environment config as setup in config > environment > development
 *
 *  #### Config format
 *  See class SaltyConfig
 **/
SaltyConfig.config = function (configFile, overrideOptions) {

  var testEnvName = process.env.NODE_ENV || 'development';

  try {

    var configSettings = SaltyConfig._loadConfigSettings(configFile, overrideOptions);

    var config = SaltyConfig._buildEnvironmentConfig(configSettings, testEnvName);
    return config;

  } catch (e) {

    console.log("Error creating the config: " + e.message);
    throw e;
  }
};


/**
 *  SaltyConfig.seasonings(configFile [optional], seasonings [optional]) -> Array
 *  - configFile (string): Relative path of `settings.yml` or `settings.json` file. This defaults to `'./../../../settings.yml'`
 *  - seasonings (Array): string[] of seasoning hints if provided programmatically eg. `saltyduck.init('settings.yml',['wd', 'node-sql'])`
 *
 *  Returns merged effective seasonings.
 *
 *
 *  ##### Options
 *
 *  If you provide no params, it will return a default config as setup in config > seasonings
 *
 **/
SaltyConfig.seasonings = function seasonings(configFile, seasonings) {

  var effectiveSeasonings = [];
  var configSettings;

  if(configFile)
    configSettings = SaltyConfig._loadConfigSettings(configFile);

  if (configSettings)
    effectiveSeasonings = configSettings.seasonings || [];

  if (seasonings) {
    if (typeof(seasonings) === 'string')
      seasonings = [seasonings];

    effectiveSeasonings = _.assign(effectiveSeasonings, seasonings);
  }

  return effectiveSeasonings;
};

/**
 *  SaltyConfig._loadConfigSettings(configFile [optional], overrideOptions [optional]) -> Array
 *  - configFile (string): Relative path of `settings.yml` or `settings.json` file. This defaults to `'./../../../settings.yml'`
 *  - seasonings (Array): string[] of seasoning hints if provided programmatically eg. `saltyduck.init('settings.yml',['wd', 'node-sql'])`
 *
 *  Returns loaded config settings object.
 *
 *
 *  ##### Options
 *
 *  If you provide no params, it will return a default config as setup in config > seasonings
 *
 **/

SaltyConfig._loadConfigSettings = function _loadConfigSettings(configFile, overrideOptions) {
  //note: default YAML is the default config file format (JSON is the other option, JS too is possible)
  //note: cache supports singleton config only

  var configFilePath = DEFAULT_CONFIG_FILEPATH;
  if (configFile) {

    if (typeof(configFile) == 'string') configFilePath = configFile;
    //if only overrideOptions provided then check if configFile provided in there
    if (typeof(configFile) == 'object') {
      overrideOptions = configFile;
      configFilePath = overrideOptions.configFile || configFilePath;
    }
  }

  if (overrideOptions && overrideOptions.settingsFormat && overrideOptions.settingsFormat == 'json') {
    //if (!_.endsWith('json', configFilePath))
    if (!path.extname(configFilePath).toLowerCase() == 'json')
      throw new Error('Settings expected in json format, eg. ./settings.json. File provided was ' + configFilePath);

    _configSettings = require(configFilePath);

  } else {
    //todo: [kj] test yaml configs here .. this one is too brittle
    var ymlPath = configFilePath;
    if (!_.endsWith('yml', configFilePath))
      ymlPath = configFilePath.replace(/.json/, '.yml');
    ymlPath = path.join(__dirname, configFilePath);

    _configSettings = yaml.load(fs.readFileSync(ymlPath), 'utf8');

    //console.log(configSettings);
  }

  return _configSettings;

};

SaltyConfig._buildEnvironmentConfig = function _buildEnvironmentConfig(configSettings, testEnvName, options) {
  //todo: [kj] merge default and env-specific configs and return config obj
  //use overrideOptions also
  if (configSettings && configSettings.environments) {

    var environmentConfig = _.assign(configSettings.environments['common'], configSettings.environments[testEnvName]);

    if (options)
      environmentConfig = _.assign(environmentConfig, options.environment);
    //todo:[kj] trace effective config
    //console.log(environmentConfig);
    return environmentConfig;

  } else {
    throw new Error("Environment config file error for " + testEnvName);
  }
};