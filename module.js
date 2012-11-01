
// Create a simple (non-script loading), amd based define / require implementation

// Sample usage:

/*
define('app', ['config', 'utils'], function (config, utils) {});

var app = require('app');
*/

var define, require;

(function (undefined) {

    define = function (id, dependencies, factory) {};

    require = function (id) {};

}());