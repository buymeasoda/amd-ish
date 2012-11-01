
// Create a simple (non-script loading), amd based define / require implementation

// Sample usage:

/*
define('app', ['config', 'utils'], function (config, utils) {});

var app = require('app');
*/

var define, require;

(function (undefined) {

    var defined = {};

    define = function (id, dependencies, factory) {
        if (factory === undefined) {
            factory = dependencies;
            dependencies = [];
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