'use strict';

var colors = require('colors');
var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
//chai.use(chaiAsPromised);
var sinon = require('sinon');
chai.expect(); //use expect to assert conditions
var testConfig = require('./../testconfig');

describe('Salty API Driver', function () {

  describe('.loadApiObjects', function(){

    var dummyFilePath = './../../tests/api/dummy.api.js';

    it('should load the scope for an endpoint', function(){
      var duck = require('./../../index');

      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      expect(saltyDuck.loadApiObjects).to.not.be.null;

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope).to.not.be.null;
      expect(dummyApiScope.name).to.eq('dummyAPI');

    });
    it('should load a basic GET request for an endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('requests');
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_basic.template() )
          .to.eq("q=Stevie%20Wonder&type=artist");

    });
    it('should bind a GET request template for an endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('requests');
      //fetch original template
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.template())
          .to.eq("q={{artist}}&type=artist");
      //basic binding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.bindParams({artist:'Hendrix'}))
          .to.eq("q=Hendrix&type=artist");
      //ensure binding handles url encoding
      expect(dummyApiScope.searchEndpoint.requests.searchGetRequest_template.bindParams({artist:'Jimi Hendrix'}))
          .to.eq("q=Jimi%20Hendrix&type=artist");

    });
    it('should bind a POST request for the endpoint', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope.otherEndpoint).to.include.keys('requests');
      expect(dummyApiScope.otherEndpoint
          .requests.otherPostRequest_basic).to.not.be.null;
      //assert template
      expect(dummyApiScope.otherEndpoint
          .requests.otherPostRequest_basic
          .template())
          .to.eql({
            otherName: "",
            otherList: [1,2,3,4],
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
    it('should bind the default REST headers', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope.headers['Content-Type']).to.not.be.null;
      expect(dummyApiScope.headers.ApiKey).to.eq(123456);
      expect(dummyApiScope.headers.Authorization.bind('some-auth-token'))
          .to.eq('bearer some-auth-token');

    });
    it('should bind custom headers', function(){
      var duck = require('./../../index');
      var saltyDuck = duck.init(testConfig.CONFIG_NO_SEASONINGS, 'api-driver');

      var dummyApiScope = saltyDuck.loadApiObjects(dummyFilePath);

      expect(dummyApiScope.searchEndpoint).to.include.keys('headers');
      expect(dummyApiScope.searchEndpoint.headers.version.bind('2.12.1.0'))
          .to.eq('2.12.1.0');

    });
  });
  describe('.configure', function(){
    it('should configure the api baseUrl');
    it('should ensure api is reachable');
    it('should authenticate with api as .. ');
    it('should authorize with api for .. ');
  });

});
