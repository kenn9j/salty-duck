/**
 * Created by kenny on 15/09/15.
 */

var _ = require('lodash');

function SaltySqlProvider(name){


  return this;

}

module.exports = SaltySqlProvider;


SaltySqlProvider = _.assign(SaltySqlProvider,
    {
      /**
       * inject the config
       * @param config
       */
      init: function init(config) {
        this.salt = this.config = config;
        return this;
      },
      /**
       *
       * @param name
       * @returns {*} database - db provider instance to connect, query dbs
       */
      getDb: function dbFactory(name) {
        var dbConfig = name ? this.salt[name] : this.salt.dbConfig;

        //use abstractFactory and put common methods like loadSqlObjects in base class
        if (dbConfig) {
          switch (dbConfig.dialect) {

            case 'mysql':
              throw new Error('db not defined');

            case 'pg':
              throw new Error('db not defined');

            case 'mssql':
            default :
              var sqlInstance = new SaltySqlProvider(name);
              return _.assign(sqlInstance, require('./mssql').init(this.salt));
            //todo:[kj] default should be pg

          }
        }
      },
      /**
       *
       * @param filePath
       */
      loadSqlObjects: function (filePath) {
        //load file
        //inject statements??
      }
    }
);

//module.exports = (function db(){
//
//
//  function SaltySqlProvider(name){
//
//
//    return {
//      dbName: name,
//      loadSqlObjects: function (filePath) {
//        //load file
//        //inject statements??
//      }
//    };
//
//  }
//
//  return {
//
//    /**
//     * gets a db based on the default config in the dbConfig section
//     * @param {string] [name] - can be name of alternative config section as long as it meets requirements for its dbprovider
//     * @returns {*}
//     */
//    init: function dbFactory(name){
//      var dbConfig = name ? saltyDuck.salt[name] : saltyDuck.salt.dbConfig;
//
//      //use abstractFactory and put common methods like loadSqlObjects in base class
//      if(dbConfig){
//        switch(dbConfig.dialect) {
//
//          case 'mysql':
//            throw new Error('db not defined');
//
//          case 'pg':
//            throw new Error('db not defined');
//
//          case 'mssql':
//          default :
//              var sqlInstance = new SaltySqlProvider(name);
//              return _.assign(sqlInstance, require('./mssql'));
//              //todo:[kj] default should be pg
//
//        }
//      }
//    }
//  };
//
//
//})();