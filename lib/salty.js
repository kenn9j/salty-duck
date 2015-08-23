/**
 * class Salty
 *
 * Handles helper core.
 **/

"use strict";

var colors = require('colors'),
    wd = require('wd'),
    _ = require('lodash');

var Salty = module.exports = function Salty() {
  return this;
};


//todo:[kj] construct as normal class?
Salty = _.assign(Salty, {

  //==== salty core =================
  //salt:{},
  //testConfig: {},
  //seasonings: [],

  //======== form field utils ================================
  generateRandomString: function (slength, stype) {
    // Generates random string - generateRandomString(length ["A"] ["N"] );
    // returns a random alpha-numeric string by default, if used arguments A or N
    //"A" (Alpha flag)   return random a-Z string , "N" (Numeric flag) return random 0-9 string
    stype = stype && stype.toLowerCase();
    var str = "", i = 0, min = stype == "a" ? 10 : 0, max = stype == "n" ? 10 : 62;
    for (; i++ < slength;) {
      var r = Math.random() * (max - min) + min << 0;
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }

    return str;
  }


});