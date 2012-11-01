
// Create a simple (non-script loading), amd based define / require implementation

// Sample usage:

/*
define('app', ['config', 'utils'], function (config, utils) {});

var app = require('app');
*/

var define, require;

(function (undefined) {

    var defined = {},
        active = {};

    function isType(obj, type) {
        return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === type;
    }

    define = function (id, dependencies, factory) {
        var error = [];
        if (factory === undefined) {
            factory = dependencies;
            dependencies = [];
        }
        if (defined.hasOwnProperty(id) || active.hasOwnProperty(id)) {
            error.push('Module already defined');
        }
        if (!isType(id, 'string')) {
            error.push('Id must be a string');
        }
        if (!isType(dependencies, 'array')) {
            error.push('Dependencies must be an array');
        }
        if (!isType(factory, 'function') && !isType(factory, 'object')) {
            error.push('Factory must be a function or object');
        }
        if (error.length) {
            throw new Error(error.join(', '));
        }
        defined[id] = {
            id: id,
            dependencies: dependencies,
            factory: factory
        };
    };

    require = function (id) {
        var error = [],
            met = [],
            unmet = [],
            dependecy;

        if (active.hasOwnProperty(id)) {
            return active[id];
        }
        if (!defined.hasOwnProperty(id)) {
            error.push('Module not defined');
        } else {
            for (var i = 0; i < defined[id].dependencies.length; i++) {
                dependency = defined[id].dependencies[i];
                if (!defined.hasOwnProperty(dependency) && !active.hasOwnProperty(dependency))  {
                    error.push('Dependency not met: ' + dependency);
                }
                if (defined.hasOwnProperty(dependency)) {
                    active[dependency] = require(dependency);
                    delete defined[dependency];
                }
                met.push(active[dependency]);
            }
        }
        if (error.length) {
            throw new Error(error.join(', '));
        }        
        active[id] = defined[id].factory.apply(null, met);
        delete defined[id];
        return active[id];
    };

    require.reset = function () {
        defined = {};
        active = {};
    };

}());