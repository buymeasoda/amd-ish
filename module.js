
// Create a simple (non-script loading), amd based define / require implementation

// Sample usage:

/*
define('app', ['config', 'utils'], function (config, utils) {});

var app = require('app');
*/

var define, require;

(function (undefined) {

    var defined = {};

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

    require = function (id) {};

    require.reset = function () {
        defined = {};
    };

}());