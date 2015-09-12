'use strict';

var colors = require('colors');
var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
//chai.use(chaiAsPromised);
var path = require('path');
var sinon = require('sinon');
var _ = require('lodash');
chai.expect(); //use expect to assert conditions
var testConfig = require('./../testconfig');

describe('Salty API Driver', function () {

  describe('.loadApiObjects', function(){

    var dummyRootRelativeFilePath = 'tests/api/dummy.api.js';
    var dummyRootAnchoredFilePath = '/tests/api/dummy.api.js';
    var dummyRelativeFilePath = './../../tests/api/dummy.api.js';

    //validate input params
    it('should load the scope for an endpoint using a root relative path', function(){
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      expect(saltyDuck.loadApiObjects).to.not.be.null;

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope).to.not.be.null;
      expect(dummyApiScope.name).to.eq('dummyAPI');

    });
    it('should load the scope for an endpoint using a root relative path that starts with a slash', function(){
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      expect(saltyDuck.loadApiObjects).to.not.be.null;

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootAnchoredFilePath);

      expect(dummyApiScope).to.not.be.null;
      expect(dummyApiScope.name).to.eq('dummyAPI');

    });
    it('should load the scope for an endpoint using a relative path (avoid using)', function(){
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      expect(saltyDuck.loadApiObjects).to.not.be.null;

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRelativeFilePath);

      expect(dummyApiScope).to.not.be.null;
      expect(dummyApiScope.name).to.eq('dummyAPI');

    });

    //requests templates
    it('should load a basic GET request for an endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('requests');
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_basic.template() )
          .to.eq("q=Stevie%20Wonder&type=artist");

    });
    it('should bind a GET request template for an endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('requests');
      //fetch original template
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.template())
          .to.eq("q={{artist}}&type=artist");
      //basic text binding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.bindParams('Hendrix'))
          .to.eq("q=Hendrix&type=artist");
      //multi text binding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template_withMultiplePlaceholders.bindParams('Hendrix'))
          .to.eq("q=HendrixHendrix&Hendrixtype=artist");
      //object params binding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.bindParams({artist:'Hendrix'}))
          .to.eq("q=Hendrix&type=artist");
      //object multiple params binding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template_withTwoPlaceholders.bindParams({artist1:'Hendrix',artist2:'Lennon'}))
          .to.eq("q=Hendrix,Lennon&type=artist");
      //ensure binding handles url encoding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.bindParams({artist:'Jimi Hendrix'}))
          .to.eq("q=Jimi%20Hendrix&type=artist");

    });
    it('should bind a POST request for the endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('requests');
      expect(dummyApiScope.otherEndpoint
          .requests.otherPostRequest_basic).to.not.be.null;
      //assert template
      expect(dummyApiScope.otherEndpoint
          .requests.otherPostRequest_basic
          .template())
          .to.eql({
            otherName: "",
            otherList: [],
            otherObject: { some:'deepObject' }
          });
      //assert binding
      expect(dummyApiScope.otherEndpoint
          .requests.otherPostRequest_basic
          .bindParams({otherName:'Daffy', otherList:[7,8,9]}))
          .to.eql({
            otherName: "Daffy",
            otherList: [7,8,9],
            otherObject: { some:'deepObject' }
          });
    });

    //responses templates
    it('should bind the expected Response string', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);
      expect(dummyApiScope.otherEndpoint
          .responses.otherGetResponse200
          .bindParams({Id:"007"}))
          .to.eql({
            Id: '007',
            Name: 'Bond, James'
          })
    });
    it('should bind the expected Response object', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);
      expect(dummyApiScope.otherEndpoint
          .responses.otherGetResponse200
          .bindParams({Id:"007"}))
          .to.eql({
            Id: '007',
            Name: 'Bond, James'
          })
    });

    //headers templates
    it('should bind the default REST headers', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.template()['Content-Type']).to.not.be.null;
      expect(dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.template().ApiKey).to.eq(123456);
      var templateBeforeBinding = dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.template();
      expect(dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.bindParams({Authorization:'some-auth-token'}).Authorization)
          .to.eq('bearer some-auth-token');
      var templateAfterBinding = dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.template();
      expect(templateBeforeBinding).to.not.eql(templateAfterBinding, 'is equal, which means the template was not cloned and it got overwritten');

    });
    it('should bind custom headers', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('headers');
      expect(dummyApiScope.searchEndpoint.headers.DefaultOptionsHeader.bindParams({ApiKey:'2.12.1.0'}))
          .to.eql({
            "ApiKey": "2.12.1.0",
            "Authorization": "bearer some-auth-token",
            "Content-Type": "application/json"
          });

    });

    //misc templates
    it('should load a misc string', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('misc');
      expect(dummyApiScope.otherEndpoint.misc.someSimpleText.template() )
          .to.eq("Some Simple Text");

    });
    it('should bind a misc string', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('misc');
      expect(dummyApiScope.otherEndpoint.misc.someTextTemplate
          .bindParams({bindableText:'Beautiful'}) )
          .to.eq("Some placeholder was changed to 'Beautiful'");

    });
    it('should deep bind an object template', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('misc');

      var boundObject = dummyApiScope.otherEndpoint.misc.someDeepObject
          .bindParams({
            bindableText:'Beautiful',
            level: {
              one: {
                two: {
                  three: {
                    //fourString: "some string on level 4", <-- omit a line
                    fourStringToBeBound: "'four'",
                    fourObject: {some:1, thing: 4.2, blah: 3.1}
                  }
                }
              }
            }
          });

      var expectedObject = {
        "bindableText": "Beautiful",
        "level": {
          "one": {
            "two": {
              "three": {
                "fourObject": {
                  "blah": 3.1,
                  "some": 1,
                  "thing": 4.2
                },
                "fourString": "some string on level 4",
                "fourStringToBeBound": "some string on level 'four'",
              }
            }
          }
        }
      };

      saltyDuck.quack('something', boundObject);

      expect(boundObject)
          .to.eql(expectedObject);

    });

    //endpoint
    it('should build a full endpoint url', function() {
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);
      var endpoint = dummyApiScope.otherEndpoint;

      var url = endpoint.getUrl();

      expect(url).to.be.equal(path.join(saltyDuck.salt.api.apiBaseUrl, '/v1/other') );

    });
    it('should use a mock url for an endpoint when mock switch is true');

    //fancy binding
    xit('should bind a deep object with dot separated hierarchical param key string eg User.firstName', function(){

      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyRootRelativeFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('misc');
      expect(dummyApiScope.otherEndpoint.misc.someDeepObject
          .bindParams({
            bindableText:'Beautiful',
            'level.one.two.three.fourStringToBeBound': "'four'"
          }) )
          .to.eql({
            "bindableText": "Beautiful",
            "level": {
              "one": {
                "two": {
                  "three": {
                    "fourObject": {
                      "blah": 3.1,
                      "some": 1,
                      "thing": 4.2
                    },
                    "fourString": "some string on level 4",
                    "fourStringToBeBound": "some string on level 'four'",
                  }
                }
              }
            }
          });

    });

  });
  describe('.configure', function(){
    it('should configure the api baseUrl');
    it('should ensure api is reachable');
    it('should authenticate with api as .. ');
    it('should authorize with api for .. ');
  });

});
