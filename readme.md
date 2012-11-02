# amd-ish

Simple (non-script loading), amd based define / require implementation for use in already concatinated (build process parsed) setups.

## Sample usage

### Simple define
	
	define('app', function () {});
	define('app', {});

### Define with dependencies

	define('app', ['config', 'utils'], function (config, utils) {});

### Inline require

	var app = require('app');

### Callback based require
	
	require(['app', 'widget'], function (app, widget) {});