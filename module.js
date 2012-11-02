
// Create a simple (non-script loading), amd based define / require implementation

// Sample usage:

/*
define('app', ['config', 'utils'], function (config, utils) {});

var app = require('app');
*/

var define, require;

(function (undefined) {

    var defined = {},
        active = {},
        stack = {};

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

    require = function (id, callback) {
        var resolved = [];
        stack = {};
        if (isType(id, 'array')) {
            var i = 0,
                length = id.length;
            for (; i < length; i++) {
                resolved.push(resolve(id[i]));
            }
            if (isType(callback, 'function')) {
                return callback.apply(null, resolved);
            }
        } else {
            return resolve(id);
        }
    };

    require.reset = function () {
        defined = {};
        active = {};
    };

    function resolve(id) {
        var resolved = [];
        stack[id] = true;
        if (active.hasOwnProperty(id)) {
            return active[id];
        }
        if (!defined.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' not defined');
        }
        var i = 0,
            dependencies = defined[id].dependencies,
            length = dependencies.length;
        for (; i < length; i++) {
            if (!defined.hasOwnProperty(dependencies[i]) && !active.hasOwnProperty(dependencies[i]))  {
                throw new Error('Dependency ' + dependencies[i] + ' not resolved');
            }
            if (defined.hasOwnProperty(dependencies[i]) && !stack.hasOwnProperty(dependencies[i])) {
                active[dependencies[i]] = resolve(dependencies[i]);
                delete defined[dependencies[i]];
            }
            resolved.push(active[dependencies[i]] || undefined);
        }
        active[id] = isType(defined[id].factory, 'function') ? defined[id].factory.apply(null, resolved) : defined[id].factory;
        delete defined[id];
        return active[id];
    }

}());