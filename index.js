/**
 * class Duck
 *
 * Handles helper builder.
 **/

'use strict';

var _ = require('lodash');
var colors = require('colors');
var fs = require('fs');
var path = require('path');
var _salt, _seasonings = [], _duck, _canQuack = true;
var Duck = module.exports = function Duck(salt, seasonings) {
  return this;
};

Duck = _.assign(Duck, require('./lib/salty'));
Duck = _.assign(Duck, require('./lib/config'));

/**
 *  Duck.init(options [optional], seasonings [optional], configObject [optional]) -> Duck
 *  - options (string|Object): string of configFilePath or Object of overridable properties //todo: [kj] design TBC overridable properties
 *  - seasonings (Array): string[] of seasoning hints if provided programmatically eg. `saltyduck.init('settings.yml',['wd', 'node-sql'])`
 *  - configObject (string): to override the config loading from settings.yml, provide a config object
 *
 *  Returns a Salty Duck.
 *
 *  ### Options
 *  - string, same as to options.configFile
 *  - OR
 *  - options.configFile: Eg. './../someCustomConfig.yml', './../someCustomConfig.json'
 *  - options.settingsFormat: yml [default] | json , note: for Object, just use configObject
 *  - options.environment: full or partial environment config object same as configObject. This will be merged with and override any existing env config object
 *
 *  ### Seasonings
 *  See list of available seasonings (and make sure they taste good together
 *
 *  ### ConfigObject
 *  This overrides the entire config building and directly applies the provided config.
 *  Currently, there is no schema validation, so at own risk till I sort it or I get a PR :)
 *
 *
 *
 **/

Duck.init = function init(options, seasonings, configObject) {

  //if no config use defaults
  //var saltyConfig = require('./lib/config');
  var salt = _salt = configObject || this.config(options);

  if (salt) { //todo: fix this for null config

    _canQuack = salt.debug;

    Duck.reportsFolder = _salt.reportsFolder;
    Duck.salt = Duck.testConfig = salt;
    var effectiveSeasonings = Duck.seasonings(options, seasonings);
    _.each(effectiveSeasonings, function (seasoning) {
      Duck.addSeasoning(seasoning);
    });

  } else {
    throw new Error("No config provided or available.");
  }


  _duck = Duck;

  return this;
};

/**
 *  Duck.quack(say [optional]) -> null
 *  - say (string): quacks something. Null value just quacks.
 *  - optionalObjectToQuack (object): quacks the object on a newline.
 *
 *  Console.logs what you want it to for now. Can be switched off for other environments by
 *
 *
 *  ### Turning logging on-off //todo: [kj] check quacking config design
 *  - options.debug: false | true
 *  - settings.debug: false | true
 *
 *
 *
 **/

Duck.quack = function (say, optionalObjectToQuack) {
  if (!_canQuack)
    return;
  if (say) {
    if(optionalObjectToQuack){
      console.log(say.cyan + ': ' + ('....................................................................\n'.substr(say.length)).cyan );
      console.log(optionalObjectToQuack);
      console.log('\n......................................................................\n'.cyan);
      return;
    }
    console.log(say.cyan);
    return;
  }

  var quackMessage = "\n" +
      "     _".yellow +
      "        _".yellow +
      "      _".yellow +
      "\n".yellow +
      "  __(".yellow +
      "'".red +
      ")<".yellow +
      "   __(".yellow +
      "'".red +
      ")>".yellow +
      " __(".yellow +
      "'".red +
      ")=".yellow +
      "\n".yellow +
      "  \\___)".yellow +
      " .,.".cyan +
      "\\___)".yellow +
      ",.".cyan +
      "\\___)".yellow + "\n" +
      "`','.'``,.`'..,`',.`'^.'``,.`'..,`'`".cyan +
      "\nQuack, Quack!" +
      "\n    if it quacks like a duck, it's a salty duck!\n\n";

  console.log(quackMessage);
};

/**
 * addSeasoning
 * add extensions (seasonings) to the core salty-duck helper based on what type of tests you wish to run
 * @param seasoning
 */
Duck.addSeasoning = function (seasoning) {


  var hasSeasoning = _.includes(_seasonings, seasoning);
  if(hasSeasoning)
    return;

  if (/$\./.test(seasoning) && fs.existsSync(seasoning)) {
    Duck = _.assign(Duck, require(seasoning));
    Duck.quack('Quack!'.cyan +
    ' added custom seasoning..  ' + seasoning);
  } else {
    var seasoningLib = require('./lib/seasoning/' + seasoning);
    Duck = _.assign(Duck, seasoningLib);
    Duck.quack('Quack!'.cyan +
    ' added seasoning..  ' + seasoning + " - "
    + seasoningLib.NAME + " " + seasoningLib.DESCRIPTION);
  }

  _seasonings.push(seasoning);

};

Duck.instance = function () {
  return _duck || this;
};

//
Duck.NAME = 'Duck';
Duck.VERSION = '0.0.1';

