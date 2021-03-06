
// amd-ish

// Simple (non-script loading), amd based define / require implementation
// for use in already concatinated (build process parsed) setups

// Sample usage

/*
// Simple define
define('app', function () {});
define('app', {});

// Define with dependencies
define('app', ['config', 'utils'], function (config, utils) {});

// Inline require
var app = require('app');

// Callback based require
require(['app', 'widget'], function (app, widget) {});
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
        if (defined.hasOwnProperty(id)) {
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
            for (var i = 0, length = id.length; i < length; i++) {
                resolved.push(resolve(id[i]));
            }
            return isType(callback, 'function') ? callback.apply(null, resolved) : resolved;
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
        if (!isType(id, 'string')) {
            throw new Error('Id must be a string');
        }
        if (active.hasOwnProperty(id)) {
            return active[id];
        }
        if (!defined.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' not defined');
        }
        stack[id] = true;
        for (var i = 0, dependencies = defined[id].dependencies, length = dependencies.length; i < length; i++) {
            resolved.push(!stack.hasOwnProperty(dependencies[i]) ? resolve(dependencies[i]) : active[dependencies[i]]);
        }
        active[id] = isType(defined[id].factory, 'function') ? defined[id].factory.apply(null, resolved) : defined[id].factory;
        return active[id];
    }

}());