/**
 * class SaltyApiDriver
 *
 * Handles helper for API testing with Chakram.
 **/

"use strict";

var _ = require('lodash');
var chakram = require('chakram');
var urlEncode = require('urlencode');
var path = require('path');
var saltyDuck = require('../../index');

var SaltyApiDriver = module.exports = function SaltyApiDriver(options) {
  return this;
};

var REGEX_Placeholder = /{{[a-zA-Z0-9_]*}}/;

//todo:[kj] construct as normal class
SaltyApiDriver = _.assign(SaltyApiDriver, {

  /**
   * _hydrateEndpoint
   * binds all the api objects into binders
   * @param endpointObj
   * @returns {*}
   * @private
   */
  _hydrateEndpoint: function _hydrateEndpoint(endpointObj, rootObj) {

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
    function _bindParamsToString(templateValueString) {
      //note: strings don't need cloning
      return {
        template: function () {
          return templateValueString;
        },
        bindParams: function (paramVal) {
          if (!paramVal) return templateValueString;
          if (typeof(paramVal) == 'string') {

            var boundString = templateValueString;
            while (REGEX_Placeholder.test(boundString)) {
              boundString = boundString.replace(REGEX_Placeholder, paramVal);
            }

            return boundString;
          }
          else //assume object
          {
            var boundValue = templateValueString;
            _.each(paramVal, function (itemValue, itemKey) {

              //todo: fix this

              boundValue = boundValue.replace('{{' + itemKey + '}}', itemValue);
            });
            return boundValue;
          }
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
      //note: strings don't need cloning
      return {
        template: function () {
          return templateValueString;
        },
        bindParams: function (paramVal) {
          if (!paramVal)
            return templateValueString;
          if (typeof(paramVal) == 'string') {
            var boundString = templateValueString;
            while (REGEX_Placeholder.test(boundString)) {
              boundString = boundString.replace(REGEX_Placeholder, paramVal);
            }
            return boundString;
          }
          else //assume object
          {
            var boundValue = templateValueString;
            _.each(paramVal, function (itemValue, itemKey) {

              //todo: fix this to

              boundValue = boundValue.replace('{{' + itemKey + '}}', urlEncode(itemValue));
            });
            return boundValue;
          }
        }
      };
    }
    /**
     * _bindParamsToObject
     * @param template {{}}
     * @returns {{template: Function, bindParams: Function}}
     * @private
     */
    function _bindValuesToTemplateObject(template) {

      var templateObject = _.cloneDeep(template);

      return {
        template: function () {
          return _.clone(templateObject);
        },
        bindParams: function (paramVal) {
          if (!paramVal) return templateObject;
          if (typeof(paramVal) == 'string')
            throw new Error('Provided argument must be an object');

          var boundTemplateObj = templateObject;

          _.each(paramVal, function (propertyValue, propertyKey) {

            var propToBeBound = boundTemplateObj[propertyKey];

            //for string templates
            if (typeof(propToBeBound) == 'string') {
              //if has a placeholder
              if (REGEX_Placeholder.test(propToBeBound)) {
                //render 1 or more placeholder(s)
                var boundString = propToBeBound;
                while (REGEX_Placeholder.test(boundString)) {
                  boundString = boundString.replace(REGEX_Placeholder, propertyValue);
                }
                boundTemplateObj[propertyKey] = boundString;
              } else { //as-is
                boundTemplateObj[propertyKey] = propertyValue;
              }
            } else { //property is an object

              boundTemplateObj[propertyKey] = _.merge(propertyValue, propToBeBound,
                  function (propParam, propTemplate) {

                    if (_.isUndefined(propParam) && _.isUndefined(propTemplate)) {
                        return undefined;
                    }

                    if(_.isString(propTemplate)){
                      //console.log('deep object is string ' + propTemplate);
                      if( REGEX_Placeholder.test(propTemplate) ){
                        //contains a placeholder, so bind
                        return propTemplate.replace(REGEX_Placeholder, propParam);
                      }
                    }
                    else if( !_.isObject(propTemplate) ){
                      //!obj ==~ number, etc
                      return propParam;
                    }

              });

              //boundTemplateObj[propertyKey] = propertyValue;

              //todo:[kj] recurse through this and set deeper properties?
            }
          });
          return boundTemplateObj;

        }
      };
    }

    //convert each node in the endpoint object into a parameter binder
    _.each(endpointObj, function (endpointItemVal, endpointItemKey) {

      //console.log(endpointItemKey + ":" + endpointItemVal);

      //1. bind 'requests' node
      if (endpointItemKey === 'requests') {

        _.each(endpointItemVal, function (reqValue, reqKey) {

          //incase that your value object is already a binder-ified.
          var reqValObject = reqValue.template ? reqValue.template() : reqValue;

          //1.a - GET requests
          if (/GetRequest/.test(reqKey)) {

            //bind GET request string
            if (REGEX_Placeholder.test(reqValObject)) {
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
      else if (endpointItemKey === 'responses') {

        _.each(endpointItemVal, function (propValue, propKey) {

          //in case that your value object is already a binder-ified.
          var endpointPropObj = propValue.template ? propValue.template() : propValue;

          //bind string
          if (typeof(endpointPropObj) == 'string'){
            if(REGEX_Placeholder.test(endpointPropObj)) {
              //set the request object to handle binding
              endpointObj[endpointItemKey][propKey] =
                  _bindParamsToString(endpointPropObj);
            } else {
              endpointObj[endpointItemKey][propKey] =
                  _bindParamsToReturnStringAsIs(endpointPropObj);
            }
          } else {
            //bind object
            endpointObj[endpointItemKey][propKey] =
                _bindValuesToTemplateObject(endpointPropObj);
          }
        });
      }

      //3. bind headers
      else if (endpointItemKey === 'headers') {
        _.each(endpointItemVal, function (headerValue, headerKey) {

          var headerValObject = headerValue.template ? headerValue.template() : headerValue;

          //bind headers string
          //set the object to {template(), bindParams()} handle binding
          endpointObj['headers'][headerKey] =
              _bindValuesToTemplateObject(headerValObject);
        });
      }

      //4. bind misc
      else if (endpointItemKey === 'misc') {
        _.each(endpointItemVal, function (propValue, propKey) {

          //in case that your value object is already a binder-ified.
          var endpointPropObj = propValue.template ? propValue.template() : propValue;

            //bind string
            if (typeof(endpointPropObj) == 'string'){
              if(REGEX_Placeholder.test(endpointPropObj)) {
                //set the request object to handle binding
                endpointObj[endpointItemKey][propKey] =
                    _bindParamsToString(endpointPropObj);
              } else {
                endpointObj[endpointItemKey][propKey] =
                    _bindParamsToReturnStringAsIs(endpointPropObj);
              }
            } else {
              //bind object
              endpointObj[endpointItemKey][propKey] =
                  _bindValuesToTemplateObject(endpointPropObj);
            }
        });

      }
      else if(endpointItemKey === 'url') {
        endpointObj['getUrl'] = (function(urlParams){
              return path.join(saltyDuck.salt.api.apiBaseUrl, rootObj.url,endpointItemVal);
            }).bind(this);
      }
      else {
        //do nothing
        //todo: consider binding the typeof(..) == 'function' to the context?
      }

    });

    return endpointObj;
  },
  /**
   * loadApiObjects
   * @param apiObjectsFilePath
   * @returns {{name: string, baseUrl: string, someEndpoint: {requests: {}, responses: {}, headers: {}}}}
   */
  loadApiObjects: function loadApiObjects(apiObjectsFilePath) {

    var apiObjects;
    //load from *.api.js file
    if (/^\./.test(apiObjectsFilePath)) {
      apiObjects = require(apiObjectsFilePath);
    } else {
      //expect the path to be root-relative (by convention)
      var rootMapPath = require("path").resolve('.');
      if (/^\//.test(apiObjectsFilePath))
        apiObjects = require(rootMapPath + apiObjectsFilePath);
      else
        apiObjects = require(rootMapPath + '/' + apiObjectsFilePath);

    }
    var apiScope = {name: '', baseUrl: '', someEndpoint: {requests: {}, responses: {}, headers: {}, misc: {}}};

    _.each(apiObjects, function (apiObjPropValue, apiObjPropKey) {

      //console.log(key + ":" + value);

      //endpoints are parsed into requests and response arrays
      //from the <some-api>.api.js api-objects file for that api
      //each array can be accessed via code completion
      //see unit tests for examples

      if (/.*Endpoint$/i.test(apiObjPropKey)) {
        apiScope[apiObjPropKey] = SaltyApiDriver._hydrateEndpoint(apiObjPropValue, apiObjects);
      }
      else {
        apiScope[apiObjPropKey] = apiObjPropValue;
      }
    });

    return apiScope;
  }

});

SaltyApiDriver.NAME = 'api-driver';
SaltyApiDriver.DESCRIPTION = 'API testing helper (npm > chakram)';
SaltyApiDriver.VERSION = '0.0.1';
