/**
 * Created by kenny on 23/08/15.
 */
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.expect();
var testConfig = require('./../testconfig');
var sinon = require('sinon');
var _ = require('lodash');

describe('SaltyWebDriver', function () {

  this.timeout(10000000);

  describe('.initBrowser', function () {

    it('should be part of the default saltyDuck', function () {

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS);
      saltyDuck.addSeasoning('webdriver');

      expect(saltyDuck.webdriver.initBrowser).to.be.a('function');

    });

    xit('should open a promised chained browser instance from default settings', function () {

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'webdriver');

      var browser = saltyDuck.webdriver.getBrowser(saltyDuck.salt.wd);

      //todo:[kj] setup must include npm install -g phantomjs
      //ensure tests always use phantomjs
      expect(saltyDuck.salt.wd.caps.browserName).to.be.equal('phantomjs');


      var promiseChainedRemoteBrowser =
          browser
          .sleep(saltyDuck.salt.wd.driverStartupWaitTime)
          .get('http://google.com')
          .waitForElementByCss('[name="q"]')
          .elementByCss('[name="q"]').type('devop5 agile devops cloud in sydney')
          .elementByName('btnG').click()
          .waitForElementById('resultStats').isDisplayed().should.eventually.equal(true);

      expect(promiseChainedRemoteBrowser.__wd_promise_enriched).to.be.true;

      //error scenario, continue the promise chain
      //always return the tail of the promise chain, never break the chain
      return promiseChainedRemoteBrowser
          .elementById('resultStats').isDisplayed().should.eventually.equal(false)
          .catch(function(err){
            expect(err.message).to.be.equal('expected true to equal false');
          });

    });

    it('should load the seasoning into its own namespace', function () {

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'webdriver');

      expect(saltyDuck.webdriver).to.be.a('function');
      expect(saltyDuck.webdriver.getBrowser).to.be.a('function');

    });
  });

});
