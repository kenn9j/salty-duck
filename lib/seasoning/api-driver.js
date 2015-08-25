/**
 * class SaltyApiDriver
 *
 * Handles helper for API testing with Chakram.
 **/

"use strict";

var _ = require('lodash');
var chakram = require('chakram');
var urlEncode = require('urlencode');

var SaltyApiDriver = module.exports = function SaltyApiDriver(options) {
  return this;
};


//todo:[kj] construct as normal class
SaltyApiDriver = _.assign(SaltyApiDriver, {

  _parseEndPoint: function _parseEndPoint(endpointObj) {

    /**
     * _bindParamsToReturnStringAsIs
     * used for returning actual unbound values
     * @param templateValueString
     * @returns {{template: Function, bindParams: Function}}
     * @private
     */
    function _bindParamsToReturnStringAsIs(templateValueString) {
      return {
        template: function () {
          return templateValueString;
        },
        bindParams: function () {
          return templateValueString;
        }
      };
    }

    /**
     * _bindParamsToStringUrlEncoded
     * @param templateValueString
     * @returns {{template: Function, bindParams: Function}}
     * @private
     */
    function _bindParamsToStringUrlEncoded(templateValueString) {
      return {
        template: function () {
          return templateValueString;
        },
        bindParams: function (paramVal) {
          if (!paramVal) return templateValueString;
          if (typeof(paramVal) == 'string')
            return templateValueString.replace(/{{.*}}/, paramVal);
          else //assume object
          {
            var boundValue = templateValueString;
            _.each(paramVal, function (itemValue, itemKey) {
              boundValue = boundValue.replace('{{' + itemKey + '}}', urlEncode(itemValue));
            });
            return boundValue;
          }
        }
      };
    }

    /**
     * _bindParamsToObject
     * @param templateValueObject string
     * @returns {{template: Function, bindParams: Function}}
     * @private
     */
    function _bindValuesToTemplateObject(templateValueObject) {
      return {
        template: function () {
          return templateValueObject;
        },
        bindParams: function (paramVal) {
          if (!paramVal) return templateValueObject;
          if (typeof(paramVal) == 'string')
            throw new Error('Provided argument must be an object');

          var boundValue = templateValueObject;
          _.each(paramVal, function (itemValue, itemKey) {
            boundValue[itemKey] = itemValue;
          });
          return boundValue;

        }
      };
    }

    //convert each node in the endpoint object into a parameter binder
    _.each(endpointObj, function (endpointItemVal, endpointItemKey) {

      //console.log(endpointItemKey + ":" + endpointItemVal);

      //1. bind 'requests' node
      if (endpointItemKey == 'requests') {

        _.each(endpointItemVal, function (reqValue, reqKey) {

          //incase that your value object is already a binder-ified.
          var reqValObject = reqValue.template ? reqValue.template() : reqValue;

          //1.a - GET requests
          if (/GetRequest/.test(reqKey)) {

            //bind GET request string
            if (/\{\{.*\}\}/.test(reqValObject)) {
              //set the request object to handle binding
              endpointObj['requests'][reqKey] =
                  _bindParamsToStringUrlEncoded(reqValObject);
            } else {
              endpointObj['requests'][reqKey] =
                  _bindParamsToReturnStringAsIs(reqValObject);
            }
          }

          //1.b - POST|PUT request here
          if (/PostRequest|PutRequest/.test(reqKey)) {

            //bind POST|PUT request string
            //set the request object to handle binding
            endpointObj['requests'][reqKey] =
                _bindValuesToTemplateObject(reqValObject);

          }

        });

      }

      //2. bind 'responses' node
      if (endpointItemKey == 'responses') {

        _.each(endpointItemVal, function (resValue, resKey) {

          var reqValObject = resValue.template ? resValue.template() : resValue;

          if (typeof(reqValObject) == 'string') {

            if (/\{\{.*\}\}/.test(reqValObject)) {
              endpointObj['responses'][resKey] =
                  _bindParamsToStringUrlEncoded(reqValObject);
            } else {
              endpointObj['responses'][resKey] =
                  _bindParamsToReturnStringAsIs(reqValObject);
            }

          } else {

            endpointObj['responses'][resKey] =
                _bindValuesToTemplateObject(reqValObject);
          }




        });
      }

      //3. bind custom headers
      if (endpointItemKey == 'headers') {
        _.each(endpointItemVal, function (headerValue, headerKey) {
          //if (/Response200/.test(resKey)) {
          //POST request, expect an object value

          var headerValObject = headerValue.template ? headerValue.template() : headerValue;

          //bind headers string
          //set the object to {template(), bindParams()} handle binding
          endpointObj['headers'][headerKey] = {
            template: function () {
              return headerValObject;
            },
            bindParams: function (paramVal) {
              if (!paramVal) return headerValObject;
              if (typeof(paramVal) == 'string')
                throw new Error('Params value must be be an object');

              var boundValue = headerValObject;
              _.each(paramVal, function (itemValue, itemKey) {
                boundValue[itemKey] = itemValue;
              });
              return boundValue;

            }
          };


          //}
        });
      }

    });

    return endpointObj;
  },
  _parseRequests: function _parseRequests(val) {

  },
  /**
   * loadApiObjects
   * @param apiObjectsFilePath
   * @returns {{name: string, baseUrl: string, someEndpoint: {requests: {}, responses: {}, headers: {}}}}
   */
  loadApiObjects: function loadApiObjects(apiObjectsFilePath) {

    var apiObjects;
    if(/^\./.test(apiObjectsFilePath)) {
      apiObjects = require(apiObjectsFilePath);
    } else {
      //expect the path to be root-relative (by convention)
      var rootMapPath = require("path").resolve('.');
      if(/^\//.test(apiObjectsFilePath))
        apiObjects = require(rootMapPath + apiObjectsFilePath);
      else
        apiObjects = require(rootMapPath + '/' + apiObjectsFilePath);

    }
    var apiScope = { name:'', baseUrl:'', someEndpoint: { requests:{}, responses:{}, headers:{}}};

    _.each(apiObjects, function (value, key) {

      //console.log(key + ":" + value);

      //endpoints are parsed into requests and response arrays
      //from the <some-api>.api.js api-objects file for that api
      //each array can be accessed via code completion
      //see unit tests for examples

      if (/.*Endpoint$/i.test(key)) {
        apiScope[key] = SaltyApiDriver._parseEndPoint(value);
      }
      else {
        apiScope[key] = value;
      }
    });

    return apiScope;
  }

});

SaltyApiDriver.NAME = 'api-driver';
SaltyApiDriver.DESCRIPTION = 'API testing helper (npm > chakram)';
SaltyApiDriver.VERSION = '0.0.1';
