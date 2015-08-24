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

    function _bindParamsStringReturnAsIs(reqValString) {
      return {
        template: function () {
          return reqValString;
        },
        bindParams: function () {
          return reqValString;
        }
      };
    }
    function _bindParamsStringUrlEncoded(reqValString) {
      return {
        template: function () {
          return reqValString;
        },
        bindParams: function (paramVal) {
          if (!paramVal) return reqValString;
          if (typeof(paramVal) == 'string')
            return reqValString.replace(/{{.*}}/, paramVal);
          else //assume object
          {
            var boundValue = reqValString;
            _.each(paramVal, function (itemValue, itemKey) {
              boundValue = boundValue.replace('{{' + itemKey + '}}', urlEncode(itemValue));
            });
            return boundValue;
          }
        }
      };
    };

    _.each(endpointObj, function (endpointItemVal, endpointItemKey) {
      //console.log(endpointItemKey + ":" + endpointItemVal);
      //1. bind requests
      if (endpointItemKey == 'requests') {
        _.each(endpointItemVal, function (reqValue, reqKey) {
          //1.a - GET requests
          if (/GetRequest/.test(reqKey)) {
            //GET request, expect a string value

            var reqValString = reqValue.template ? reqValue.template() : reqValue.toString();

            //bind GET request string
            if (/\{\{.*\}\}/.test(reqValString)) {
              //set the request object to handle binding
              endpointObj['requests'][reqKey] =
                  _bindParamsStringUrlEncoded(reqValString);
            }
            else {
              endpointObj['requests'][reqKey] =
                  _bindParamsStringReturnAsIs(reqValString);
            }
          }
          //1.b - POST request here
          if (/PostRequest|PutRequest/.test(reqKey)) {
            //POST request, expect an object value

            var reqValObject = reqValue.template ? reqValue.template() : reqValue;

            //bind POST|PUT request string
            //set the request object to handle binding
            endpointObj['requests'][reqKey] = {
              template: function () {
                return reqValObject;
              },
              bindParams: function (paramVal) {
                if (!paramVal) return reqValObject;
                if (typeof(paramVal) == 'string')
                  throw new Error('POST/PUT request value must be be an object');

                var boundValue = reqValObject;
                _.each(paramVal, function (itemValue, itemKey) {
                  boundValue[itemKey] = itemValue;
                });
                return boundValue;

              }
            }


          }
        });
      }
      //2. bind responses
      if (endpointItemKey == 'responses') {
        _.each(endpointItemVal, function (resValue, resKey) {
          //if (/Response200/.test(resKey)) {
          //POST request, expect an object value

          var reqValObject = resValue.template ? resValue.template() : resValue;

          //bind POST|PUT request string
          //set the request object to handle binding
          endpointObj['responses'][resKey] = {
            template: function () {
              return reqValObject;
            },
            bindParams: function (paramVal) {
              if (!paramVal) return reqValObject;
              if (typeof(paramVal) == 'string')
                throw new Error('Response params value must be be an object');

              var boundValue = reqValObject;
              _.each(paramVal, function (itemValue, itemKey) {
                boundValue[itemKey] = itemValue;
              });
              return boundValue;

            }
          };


          //}
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
  loadApiObjects: function loadApiObjects(apiNameOrObject) {

    var apiObjects = require(apiNameOrObject);
    var apiScope = {};

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
