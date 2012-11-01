
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
            error.push('Module ' + id + ' already defined');
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
            resolved = [];
        if (isType(id, 'array')) {
            for (var i = 0; i < id.length; i++) {
                require(id[i]);
            }
            return;
        }
        if (active.hasOwnProperty(id)) {
            return active[id];
        }
        if (!defined.hasOwnProperty(id)) {
            error.push('Module ' + id + ' not defined');
        } else {
            var i = 0,
                dependencies = defined[id].dependencies,
                length = dependencies.length;
            for (; i < length; i++) {
                if (!defined.hasOwnProperty(dependencies[i]) && !active.hasOwnProperty(dependencies[i]))  {
                    error.push('Dependency ' + dependencies[i] + ' not resolved');
                }
                if (defined.hasOwnProperty(dependencies[i])) {
                    active[dependencies[i]] = require(dependencies[i]);
                    delete defined[dependencies[i]];
                }
                resolved.push(active[dependencies[i]]);
            }
        }
        if (error.length) {
            throw new Error(error.join(', '));
        }
        active[id] = defined[id].factory.apply(null, resolved);
        delete defined[id];
        return active[id];
    };

    require.reset = function () {
        defined = {};
        active = {};
    };

}());