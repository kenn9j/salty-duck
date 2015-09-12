'use strict';

var colors = require('colors');
var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
//chai.use(chaiAsPromised);
var sinon = require('sinon');
chai.expect(); //use expect to assert conditions
var testConfig = require('./../testconfig');


describe('Salty Duck', function () {

  describe('.init', function () {

    it('should initialise a salty duck by default', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      expect(saltyDuck).not.to.be.null;
      expect(saltyDuck.quack).not.to.be.null;


      //expect(saltyDuck).to.have.deep.property('salt.debug', true);

    });
    it('should initialise a salty duck with options', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init({configFile: testConfig.DEFAULT_CONFIG_FOR_TESTS});

      expect(saltyDuck).not.to.be.null;
      expect(saltyDuck.quack).not.to.be.null;

    });
    it('should initialise a salty duck with seasonings', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'wd');

      expect(saltyDuck).not.to.be.null;
      expect(saltyDuck.initBrowser).not.to.be.null;

    });
    it('should initialise a salty duck from a provided config object', function () {
      var duck = require('./../../index');
      var obj = require('./../config/settings-json.json');

      var saltyDuck = duck.init(null, 'wd', obj.environments['development']);

      expect(saltyDuck).not.to.be.null;
      expect(saltyDuck.initBrowser).not.to.be.null;

    });

  });

  describe('.quack', function () {

    it('should log a default message when debug is true', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      saltyDuck.quack();

      var sandbox = sinon.sandbox.create();

      try {
        sandbox.stub(console, "log");

        saltyDuck.quack();


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

        sinon.assert.calledWithExactly(console.log, quackMessage);

      } catch (e) {
        throw e;
      } finally {
        sandbox.restore();
      }

    });
    it('should log a message when debug is true', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      var sandbox = sinon.sandbox.create();

      try {

        sandbox.stub(console, "log");

        saltyDuck.quack('this must be logged');

        sinon.assert.calledWithMatch(console.log, 'this must be logged');

      } catch (e) {
        throw e;
      } finally {
        sandbox.restore();
      }


    });
    it('should not log a message when debug is false', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_DEBUG);

      var sandbox = sinon.sandbox.create();
      sandbox.stub(console, "log");

      saltyDuck.quack('this must not be logged');

      sinon.assert.notCalled(console.log);

      sandbox.restore();

    });
    it('should dump an object with a message when debug is true', function () {
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.DEFAULT_CONFIG_FOR_TESTS);

      saltyDuck.quack('Fancy object', {I: 'am a fancy object', that: 'is being dumped on the console', by: 'a duck'});

      var sandbox = sinon.sandbox.create();
      sandbox.stub(console, "log");

      saltyDuck.quack('Fancy object', {I: 'am a fancy object', that: 'is being dumped on the console', by: 'a duck'});

      sinon.assert.called(console.log);

      sandbox.restore();

    });

  });
});