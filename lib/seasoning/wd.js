/**
 * class SaltyWebDriver
 *
 * Handles helper with WebDriver usage with wd.js.
 **/

"use strict";

var _ = require('lodash');
var Salty = require('./../salty').instance;
var wd = require('wd');

var fs = require('fs'),
    path = require('path');


//WebDriver
var think_time = 50,
    screenshot_time = 2000,
    animation_time = 1500;

var SaltyWebDriver = module.exports = function SaltyWebDriver(options) {
  return this;
};

SaltyWebDriver = _.assign(SaltyWebDriver, {

  //core helpers ===========
  baseUrl: function () {
    return this.getUrl("");
  },
  getUrl: function (url) {
    if (url == null) {
      //return this._salt.driverOptions.baseUrl;
      return this.testConfig.driverOptions.baseUrl;
    }
    else {
      return this.testConfig.driverOptions.baseUrl + url;
    } //asas
    //return this.testConfig.driverOptions.baseUrl + url;
  },

  getBrowser: function (config) {

    wd.configureHttp(config.driverOptions);

    var browser;
    try {
      browser = wd.promiseChainRemote(config.driverConfig);
    } catch (err) {
      console.log(err.stack || String(err));
      throw err;
    }

    return SaltyWebDriver.initBrowser(browser, config);

  },
  initBrowser: function (browser, config) {

    SaltyWebDriver.thinkTime = config.thinkTime ? config.thinkTime : think_time;
    SaltyWebDriver.screenshotTime = config.screenshotTime ? config.screenshotTime : screenshot_time;
    SaltyWebDriver.animationTime = config.animationTime ? config.animationTime : animation_time;


    if (config.verbose_logging) {
      browser._debugPromise();
      browser.on('status', function (info) {
        console.log(info.cyan);
      });
      browser.on('command', function (eventType, command, response) {
        console.log(' > ' + eventType.cyan, command, (response || '').grey);
      });
      browser.on('http', function (meth, path, data) {
        console.log(' >> ' + meth.magenta, path, (data || '').grey);
      });
    }

    browser
        .init(config.caps)
        .setImplicitWaitTimeout(config.implicitWaitTimeout)
        .setAsyncScriptTimeout(config.asyncScriptTimeout);

    //inject helper methods here
    //todo: [kj] fix this scope issue
    SaltyWebDriver.addPromiseMethodToWd('wait', SaltyWebDriver.wait);
    SaltyWebDriver.addPromiseMethodToWd('select2QuickPicker', SaltyWebDriver.select2QuickPicker);
    SaltyWebDriver.addPromiseMethodToWd('select2Picker', SaltyWebDriver.select2Picker);
    SaltyWebDriver.addPromiseMethodToWd('select2Selected', SaltyWebDriver.select2Selected);
    SaltyWebDriver.addPromiseMethodToWd('select2Change', SaltyWebDriver.select2Change);
    SaltyWebDriver.addPromiseMethodToWd('selectUserLocation', SaltyWebDriver.selectUserLocation);
    SaltyWebDriver.addPromiseMethodToWd('saveScreenshotTaggedAs', SaltyWebDriver.saveScreenshotTaggedAs);
    SaltyWebDriver.addPromiseMethodToWd('doSelect', SaltyWebDriver.doSelect);
    SaltyWebDriver.addPromiseMethodToWd('isOptionSelected', SaltyWebDriver.isOptionSelected);
    SaltyWebDriver.addPromiseMethodToWd('isNotPresent', SaltyWebDriver.isNotPresent);
    SaltyWebDriver.addPromiseMethodToWd('doSqlQuery', SaltyWebDriver.doSqlQuery);
    //wd.addElementPromiseChainMethod('isNotPresent', SaltyWebDriver.isNotPresent);
    SaltyWebDriver.addPromiseMethodToWd('generateRandomString', SaltyWebDriver.generateRandomString);

    //cache it here (check for mem leaks)
    this.browser = browser;

    return browser;

  },


  //screenshot helpers ==== put into reporters?
  getScreenshotLocation: function (dir, suffix) {
    //todo:[kj] delete ./reports folder and run this to refactor location path issue
    if (!dir) dir = Salty.reportsFolder;
    var dateFormatted = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/\:/, '').replace(/\:/, '');
    var dateDir = path.join(process.cwd(), dir, dateFormatted.substr(0, 10));
    var dateFilename = path.join(dateDir, dateFormatted + '.png');
    if (suffix) dateFilename = path.join(dateDir, dateFormatted + '-' + suffix + '.png');
    //folder creation
    if (!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir);
    }
    return {dir: dateDir, filename: dateFilename};
  },
  writeScreenshot: function (err, data) {
    if (err) throw err;

    var location = this.getScreenshotLocation(this.test_folder); //todo: test_folder variable here
    //sync version
    /*if (!fs.existsSync(location.dir)) {
     fs.mkdirSync(location.dir);
     }
     return fs.writeFile(location.filename, data, 'base64', function (err) {
     if (err) {
     console.log(err);
     throw err;
     }
     });*/
    //async version
    return fs.mkdir(location.dir, function (err) {
      if (err && err.code !== 'EEXIST') {
        console.log(err);
        throw err;
      }
      return fs.writeFile(location.filename, data, 'base64', function (err) {
        if (err) {
          console.log(err);
          throw err;
        }
      });
    });
  },
  saveScreenshotTaggedAs: function (suffix) {
    //var suffix = (arguments && arguments.length > 0) ? arguments[0] : null;
    var filePath = SaltyWebDriver.getScreenshotLocation(this.reportsFolder, suffix).filename;
    console.log("Screenshot: "+ filePath);
    return this.saveScreenshot(filePath).sleep(
        screenshot_time);
  },

  //page objects injector ========
  inject: function (browser, page, config) {

    //polymorphic example
    //from base

    if (!browser)
      return new Error('Must pass instance of webdriver browser.');

    if(!config)
      throw new Error('Must pass a config.');
    //todo:[kj] refactor - current config only used to turn verbose logging on
    //todo: [kj] resolve how to manage verbose logging via calls
    //current config only used to turn verbose logging on
    var verbose_logging = config.verbose_logging;

    //recurse if array of pages
    var _this = this;
    //we get a set of pages, inject each page
    if (Array.isArray(page)) {
      _.forEach(page, function (page) {
        _this.inject(browser, page, config);
      });
      return;
    }

    //inject a single page
    this.quack('Injecting..' + page.Name);

    if (/\./.test(page.Name))
      throw new Error('pageobjects.Name must not contain a period(.)');

    _.forEach(page, function (meth, n) {
      //inject method with aspects here
      //except for unbreakable chains
      var m;
      //all methods starting with 'do..,is...,elementsBy...' will not have anything injected around them (eg. thinktime, etc)
      if (/^(do|elementsBy|is).+/.test(n)) {

        m = function () {
          return meth.apply(this.browser);
        };

        _this.addPromiseMethodToWd(n, m, true);
      }
      else if (/^ByIds/.test(n)) {
        //populate using Ids
        _.forEach(meth, function (elementId, n) {
          m = function () {
            this.pageObject = n;
            this.selector = elementId;
            return this.elementByIdOrNull(elementId != '' ? elementId : n);
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return elementId;
          }, false);
        });
      }
      else if (/^ByCss$/.test(n)) {
        //populate using accessibilityId
        _.forEach(meth, function (cssSelector, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.elementByCssSelectorOrNull(cssSelector);
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return cssSelector;
          }, false);
        });
      }
      else if (/^SafeExecute$/.test(n)) {
        //populate using accessibilityId
        _.forEach(meth, function (cssSelector, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.safeExecute(cssSelector);
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return cssSelector;
          }, false);
        });
      }
      else if (/^ByAccessibilityIds$/.test(n)) {
        //populate using accessibilityId
        _.forEach(meth, function (accessibilityId, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.elementByAccessibilityIdOrNull(accessibilityId);
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return cssSelector;
          }, false);
        });
      }
      else if (/^ByNgModel$/.test(n)) {
        //populate using css via attribute [data-ng-model=xxx]
        _.forEach(meth, function (ngmodel, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.elementByCssSelectorOrNull('[data-ng-model="' + ngmodel + '"]');
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return '[data-ng-model="' + ngmodel + '"]';
          }, false);
        });
      }
      else if (/^ByNgOptions$/.test(n)) {
        //populate using css via attribute [data-ng-model=xxx]
        _.forEach(meth, function (ngoptions, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.elementsByCssSelector('[data-ng-options="' + ngoptions + '"] > option');
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return '[data-ng-options="' + ngoptions + '"] > option';
          }, false);
        });
      }
      else if (/^ByXPath$/.test(n)) {
        //populate using accessibilityId
        _.forEach(meth, function (xpathToElement, n) {
          m = function () {
            this.pageObject = n;
            this.selector = cssSelector;
            return this.elementByXPath(xpathToElement);
          };
          _this.addPromiseMethodToWd(n, m);
          //store selector for convenience
          _this.addPromiseMethodToWd(n + "_Selector", function () {
            return xpathToElement;
          }, false);
        });
      }
      else if (/^(inject|Url|Name)$/.test(n)) {
        //do nothing;
      }
      else {
        if (verbose_logging) console.warn('WARN: Unwrapped method being injected into the app : [' + n + ']')
        //add to promise
        _this.addPromiseMethodToWd(n, meth);
      }
    });
  },
  addPromiseMethodToWd: function (n, meth, doNotWrapThinktime, isElementMethod) {
    var m;
    //apply think time as needed
    if (!doNotWrapThinktime && think_time) {
      m = function () {
        return meth.apply(this.sleep(think_time), arguments);
      }; //note sleep returns 'this', which == browser
    } else {
      m = meth.apply(this, arguments);
    }

    if (!isElementMethod) {
      wd.addPromiseChainMethod(n, m);
    } else {
      wd.addElementPromiseChainMethod(n, m);
    }
  },

  //common actions  ===================================
  doSelectDefault: function (options, optName, selector) {
    //default is the slo option
//      $(selector).val(optName);
    _.forEach(options, function (opt) {
      opt.text().then(function (optText) {
        if (optText === optName) {
          return opt.click();
        }
      });
    });
  },
  doSelect: function (selector, optName) {
//      $(selector).val(optName);
    return SaltyWebDriver.browser
        .safeExecute("" +
        "$('" + selector + "')" +
        ".each(" +
        "function(){ if($(this).text().trim() == \"" + optName + "\"){ $(this).click(); } } " +
        ")"
    );
  },
  isOptionSelected: function (options, optName) {
    _.forEach(options, function (opt) {
      opt.isSelected().then(function (selected) {
        if (selected) {
          return true;
        }
      });
    });
  },
  isElementPresent: function (browserSelector) {

    //note: browserSelector is a browser promise returns a string
    //any pageobject element eg. SomePage_SomeElement
    // when suffixed with "_Selector" will return the original selector
    // so all caller methods must provide the this.browser.SomePage_SomeElement_Selector()
    //for this method to check if the element is present

    return browserSelector
        .then(function (selector) {
          //use jquery to find elements that match selector
          //jquery always returns an array, so check its length
          selector = "$('" + selector + "').length";

          return Salty.browser
              .safeExecute(selector)
              .then(function (found) {
                //assert if 1 or more items found
                //console.log("found: " + found);
                return (!isNaN(found) && found > 0);
              });
        });
  },
  isNotPresent: function (errMsg) {
    //var driver = this.then ? this : this.browser;
    //normally a promise should be returned when an Element is not found
    //if this not a promise (ie. does not have a 'then' method, it must be an element (assumption)
    if (this.then) { //check if its a promise
      return this
        //.then(function(val){
        //  console.log(val);
        //})
          .should.eventually.equal(void 0); //undefined
    } else {
      throw new Error('Unexpected element is present - ' + errMsg ? errMsg : "error message not set with element name");
    }
  },


  //==== wd-select-2 seasoning ====================================
  select2QuickPicker: function(modelKey, searchFor) {
    var stepBrowser = Salty.browser;
    //todo:[kj] this is a hack and should be in the world.js. Helpers.js must not know about pageObject/element at all
    if(modelKey=='beneBank.Ccy') {
      stepBrowser = stepBrowser
          .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] a').click()")
          .sleep(500)
          .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] li.ui-select-choices-row:contains(\"" + searchFor + "\")').click()")
          .sleep(50);
      return stepBrowser;
    }
    else{
      stepBrowser = stepBrowser
          .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] a').click()")
          .sleep(500)
          .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] li.ui-select-choices-row:contains(\"" + searchFor + "\")').filter(function(i, el) { return el.innerText.trim() == \"" + searchFor + "\"; }).click()")
          .sleep(50);
      return stepBrowser;
    }
  },
  select2Selected: function (modelKey, searchFor) {
    //var cssSelector = 'div[data-ng-model="' + modelKey + '"] .select2-chosen > span:first-child'; //todo: move to select2 helpers
    var cssSelector = 'div[data-ng-model="' + modelKey + '"] .select2-chosen>span'; //todo: move to select2 helpers
    //look for a div that is bound to model bene.Ccy
    //drill into its elements to find the chosen element
    return Salty.browser
      //.elementByCss(cssSelector)
        .safeExecute("$('" + cssSelector + "').text()")

  },
  select2Picker: function (modelKey, searchFor, searchIsOff) {

    var stepBrowser = Salty.browser;

    //li.ui-select-choices-group > ul.select2-result-single >

    stepBrowser = stepBrowser
      //click on the top element
        .sleep(100)
        .waitForElementByCss('div[data-ng-model="' + modelKey + '"] > .select2-choice')
        .click()
        .sleep(2000);

    if (searchFor && searchFor.length > 0 && !searchIsOff) {
      stepBrowser = stepBrowser
        // use the search (preferred for long, dynamically rendered lists
          .waitForElementByCss('div[data-ng-model="' + modelKey + '"] > .select2-drop input.select2-input')
          .type(searchFor)
          .sendKeys('\ue007')
          .sleep(4000);
    }


    stepBrowser = stepBrowser
      //this script checks if the div that contains the full text (including the highlighted span) are equal the searchFor keyword. If so, the element will be clicked.
      //Eg. if you type 'India', you get 'British Indian Ocean..' also.India
      // Doing text matches does not work as select2 creates spans within the div to highlight the search keyword
      // You have to select all divs that contain the span and the rest of the text eg. <div..>British <span ..>India</span>n Ocean Territories</div>
      // then you have to match the search keyword to the entire extracted text of the enclosing div

      //close it //todo: [kj] test option of passing a regex in searchFor instead of string eg. new RegExp('^'+searchString.replace(' ','\s')+'\s\(.*\)$', i) will mean find starts with the word
        .safeExecute("$('[data-ng-model=\"" + modelKey + "\"] " +
          //"li.select2-result-with-children div.select2-result-label:contains(\"" + searchFor + "\")')" +
        "li div.select2-result-label:contains(\"" + searchFor + "\")')" +
        ".each(function(){ " +
        "   var elementText = $(this).text().trim();" +
        "   if( elementText.indexOf( \"" + searchFor + "\") == 0 || new RegExp(\"" + searchFor + "\", \"i\").test(elementText) ) {" +
        "     $(this).click(); return false; " +
        "   } " +
          //"   else {" +
          //"     return true;" +
          //"   }" +
        "});"
    )
        .sleep(4000);
    //.elementByCssSelector('div[data-ng-model="' + modelKey + '"] > .select2-choice')
    //.click();

    return stepBrowser;

  },
  selectPicker: function(modelKey, selectByName){
    return Salty.browser
        .safeExecute('$(\'select[data-ng-model="' +
        modelKey +
        '"]\').val($(\'[data-ng-model="' +
        modelKey +
        '"] option\').filter(function(){ return ($(this).text() == "'+ selectByName +'");}).val())');

  },
  select2Change: function (modelKey, selectByValue) {
    return Salty.browser
        .safeExecute('$(\'[data-ng-model="' +
        modelKey +
        '"]\').val($(\'[data-ng-model="' +
        modelKey +
        '"] option\').filter(function(){ return ($(this).text() == \'' + selectByValue + '\');}).val()).change()');
  },
  selectUserLocation: function(modelKey, Location){
    return Salty.browser
        .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] a').click()")
        .sleep(600)
        .safeExecute("$('div[data-ng-model=\"" + modelKey + "\"] li.ui-select-choices-row:contains(\"" + Location + "\")').click()")
        .sleep(100);
  },


});

SaltyWebDriver.NAME = "SaltyWebDriver";
SaltyWebDriver.DESCRIPTION = "Helper for wd.js (npm > wd)";
SaltyWebDriver.VERSION = "0.0.1";



