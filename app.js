/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var path = require("path");
var Q = require("q");
var Symbol = require("symbol");
var LangUtils = require("@themost/common").LangUtils;
var IApplication = require("@themost/common/app").IApplication;
var DefaultDataContext = require("@themost/data/data-context").DefaultDataContext;
var ConfigurationBase = require("@themost/common/config").ConfigurationBase;
var DataConfigurationStrategy = require("@themost/data/data-configuration").DataConfigurationStrategy;
var DataConfiguration = require("@themost/data/data-configuration").DataConfiguration;
var ODataConventionModelBuilder = require("@themost/data/odata").ODataConventionModelBuilder;
var ODataModelBuilder = require("@themost/data/odata").ODataModelBuilder;
var ServicesConfiguration = require("./app-services-configuration").ServicesConfiguration;


let configurationProperty = Symbol('configuration');
let applicationProperty = Symbol('application');
let unattendedProperty = Symbol('unattended');
/**
 * @class
 * @implements IApplication
 * @param {string} configurationPath - The configuration directory path
 */ 
function ExpressDataApplication(configurationPath) {
  
    ExpressDataApplication.super_.bind(this)();
    // initialize @themost/data configuration
    this[configurationProperty] = new ConfigurationBase(path.resolve(process.cwd(), configurationPath));
    // use default data configuration strategy
    this[configurationProperty].useStrategy(DataConfigurationStrategy, DataConfigurationStrategy);
    // use default model builder
    this.useModelBuilder();
    // register configuration services
    ServicesConfiguration.config(this);
}
LangUtils.inherits(ExpressDataApplication, IApplication);

/**
 * Registers an application strategy e.g. a singleton service which is going to be used in application context
 * @param {Function} serviceCtor
 * @param {Function} strategyCtor
 * @returns IApplication
 */
// eslint-disable-next-line no-unused-vars
ExpressDataApplication.prototype.useStrategy = function(serviceCtor, strategyCtor) {
    this[configurationProperty].useStrategy(serviceCtor, strategyCtor);
    return this;
};
/**
 * Returns the instance of ODataModelBuilder strategy which has been activated for this application
 * @returns ODataModelBuilder
 */ 
ExpressDataApplication.prototype.useModelBuilder = function() {
    // initialize data model builder
    let builder = new ODataConventionModelBuilder(new DataConfiguration(this.getConfiguration().getConfigurationPath()));
    // initialize model builder
    builder.initializeSync();
    // use model convention builder
    this.useStrategy(ODataModelBuilder, function() {
      return builder;
    });
};
/**
 * Returns the instance of ODataModelBuilder strategy which has been activated for this application
 * @returns ODataModelBuilder
 */ 
ExpressDataApplication.prototype.getBuilder = function() {
  return this.getStrategy(ODataModelBuilder);
}

/**
 * Checks if the current application has a strategy of the given type
* @param {Function} serviceCtor
* @returns {boolean}
*/
// eslint-disable-next-line no-unused-vars
ExpressDataApplication.prototype.hasStrategy = function(serviceCtor) {
    return this[configurationProperty].hasStrategy(serviceCtor);
};

/**
 * Gets an application strategy based on the given base service type
 * @param {Function} serviceCtor
 * @return {*}
 */
// eslint-disable-next-line no-unused-vars
ExpressDataApplication.prototype.getStrategy = function(serviceCtor) {
    return this[configurationProperty].getStrategy(serviceCtor);
};
/**
 * @returns {ConfigurationBase}
 */
ExpressDataApplication.prototype.getConfiguration = function() {
    return this[configurationProperty];
};

/**
 * Creates a new data context based on the current configuration
 * @returns {ExpressDataContext}
 */
ExpressDataApplication.prototype.createContext = function() {
    let context = new ExpressDataContext(this.getConfiguration());
    context[applicationProperty] = this;
    return context;
};

/**
 * Gets an application service based on the given base service type
 * @param {Function} serviceCtor
 * @return {*}
 */
ExpressDataApplication.prototype.getService = function(serviceCtor) {
    return this.getStrategy(serviceCtor);
};

/**
 * Checks if the current application has a strategy of the given type
 * @param {Function} serviceCtor
 * @return {boolean}
 */
ExpressDataApplication.prototype.hasService = function(serviceCtor) {
    return this.hasStrategy(serviceCtor);
};

/**
 * Registers an application service e.g. a singleton service which is going to be used in application context
 * @param {Function} serviceCtor
 * @returns ExpressDataApplication
 */
// eslint-disable-next-line no-unused-vars
ExpressDataApplication.prototype.useService = function(serviceCtor) {
    return this.useStrategy(serviceCtor, serviceCtor);
};

/**
 * @callback ExpressDataApplication~executeCallback
 * @param {Error=} err
 * @param {*=} value
 */

/**
 * @callback ExpressDataApplication~executeCallable
 * @param {ExpressDataContext} context
 * @param {ExpressDataApplication~executeCallback} cb
 */
 
/**
 * Creates an new context and executes the given callable. Use this method to execute a function 
 * as a service by initializing a data context outside of an HTTP request
 * @param {ExpressDataApplication~executeCallable} callable A callable function to execute
 * @param {ExpressDataApplication~executeCallback} callback A callback function for finalizing data context
 */ 
ExpressDataApplication.prototype.execute = function(callable, callback) {
  // create context
  let context = this.createContext();
  //execute callable function with the context as parameter
  return callable(context, function (err, value) {
      // finalize data context
      context.finalize(function() {
          // and finally execute callback
         return callback(err, value);
       });
  });
};


ExpressDataApplication.prototype.middleware = function() {
  var thisApp = this;
  return function dataContextMiddleware(req, res, next) {
      
      let context = new ExpressDataContext(thisApp.getConfiguration());
      // define application property
      context[applicationProperty] = thisApp;
      /**
       * Gets the current context user
       * @name user
       * @type {*}
       * @memberOf ExpressDataContext
       */
      Object.defineProperty(context, 'user', {
        get: function() {
          return req.user;
        },
        set: function(value) {
          req.user = value;
        }
      });
      /**
       * @name context
       * @type {ExpressDataContext}
       * @memberOf req
       */
      Object.defineProperty(req, 'context', {
        get: function() {
          return context;
        }
      });
      req.on('end', function() {
        //on end
        if (req.context) {
          //finalize data context
          return req.context.finalize(()=> {
            //
          });
        }
      });
      return next();
  };
};
/**
 * Enables passport basic authorization based on @themost/data user management
 */ 

/**
 * @class
 * @inherits DefaultDataContext
 * @param {ConfigurationBase=} configuration
 */ 
function ExpressDataContext(configuration) {
    ExpressDataContext.super_.bind(this)();
    this.getConfiguration = function() {
        return configuration;
    };
}
LangUtils.inherits(ExpressDataContext, DefaultDataContext);
/**
 * @param {Function} strategyCtor
 */ 
ExpressDataContext.prototype.getStrategy = function(strategyCtor) {
    return this.getConfiguration().getStrategy(strategyCtor);
};

/**
 * @returns {IApplication}
 */ 
ExpressDataContext.prototype.getApplication = function() {
    return this[applicationProperty];
};

/**
 * @callback ExpressDataContext~unattendedCallable
 * @param {ExpressDataApplication~executeCallback} cb
 */
 
 /**
 * @callback ExpressDataContext~unattendedCallback
 * @param {Error=} err
 * @param {*=} value
 */

/**
 * Executes the specified callable in unattended mode.
 * @param {ExpressDataContext~unattendedCallable} callable
 * @param {ExpressDataContext~unattendedCallback} callback
 */
ExpressDataContext.prototype.unattended = function(callable, callback) {
    var self = this;
    var interactiveUser;
    if (typeof callback !== 'function') {
        throw new Error('Invalid argument. Unattended callback must be a function.');
    }
    if (typeof callable !== 'function') {
        return callback(new Error('Invalid argument. Unattended callable must be a function.'));
    }
    // if context is already in attended mode execute callable
    if (self[unattendedProperty]) {
        try {
            return callable.bind(self)(function(err, result) {
                return callback(err, result);
            });
        }
        catch(err) {
            return callback(err);
        }
    }
    // get unattended execution account
    var account = self.getConfiguration().getSourceAt('settings/auth/unattendedExecutionAccount');
    // get interactive user
    if (self.user) {
        interactiveUser = Object.assign({}, self.user);
        // set interactive user
        self.interactiveUser = interactiveUser;
    }
    if (account) {
        self.user = { name:account, authenticationType:'Basic' };
    }
    try {
      // set unattended flag
        self[unattendedProperty] = true;
        return callable.bind(self)(function(err, result) {
            //restore user
            if (interactiveUser) {
                self.user = Object.assign({ }, interactiveUser);
            }
            delete self.interactiveUser;
            delete self[unattendedProperty];
            return callback(err, result);
        });
    }
    catch(err) {
        // restore user
        if (interactiveUser) {
            self.user = Object.assign({ }, interactiveUser);
        }
        // delete temporary interactive user
        delete self.interactiveUser;
        // delete unattended flag
        delete self._unattended;
        return callback(err);
    }
};

module.exports.ExpressDataContext = ExpressDataContext;
module.exports.ExpressDataApplication = ExpressDataApplication;