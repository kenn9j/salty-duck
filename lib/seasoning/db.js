/**
 * Created by kenny on 15/09/15.
 */

var _ = require('lodash');
var saltyDuck = require('./../../index');

module.exports = (function db(){

  function SaltySqlProvider(name){
    this.dbName = name;
    this.loadSqlObjects = function(filePath){
      //load file
      //inject statements??
    };
  }

  return {

    /**
     * gets a db based on the default config in the dbConfig section
     * @param {string] [name] - can be name of alternative config section as long as it meets requirements for its dbprovider
     * @returns {*}
     */
    getDb: function dbFactory(name){
      var dbConfig = name ? saltyDuck.salt[name] : saltyDuck.salt.dbConfig;

      //use abstractFactory and put common methods like loadSqlObjects in base class
      if(dbConfig){
        switch(dbConfig.dialect) {

          case 'mysql':
            throw new Error('db not defined');

          case 'pg':
            throw new Error('db not defined');

          case 'mssql':
          default :
              var sqlInstance = new SaltySqlProvider(name);
              return _.assign(sqlInstance, require('./mssql'));
              //todo:[kj] default should be pg

        }
      }
    }
  };


})();