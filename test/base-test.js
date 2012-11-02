buster.testCase('Base', {

    tearDown: function () {
        require.reset();
    },

    'define and require functions exist': function () {
        assert.isFunction(define);
        assert.isFunction(require);
    },

    'define throws an exception if module definition is invalid': function () {
        assert.exception(function () {
            define('app');
        });
        assert.exception(function () {
            define('app', []);
        });
        assert.exception(function () {
            define('app', '');
        });
        assert.exception(function () {
            define('app', {length: true, splice: true}, function () {});
        });
        assert.exception(function () {
            define('app', [], []);
        });
        assert.exception(function () {
            define('app', function () {}, []);
        });
        assert.exception(function () {
            define(function () {});
        });
        assert.exception(function () {
            define([], function () {});
        });
        assert.exception(function () {
            define({}, [], function () {});
        });
    },

    'define throws an exception if module already defined': function () {
        define('app', [], function () {});
        assert.exception(function () {
            define('app', function () {});
        })
        require('app');
        assert.exception(function () {
            define('app', function () {});
        })
    },

    'requiring an undefined module throws an exception': function () {
        assert.exception(function () {
            require('app');
        });
    },

    'requiring a defined module with unmet dependencies throws an exception': function () {
        define('app', ['utils'], function () {});
        assert.exception(function () {
            require('app');
        });
    },

    'simple define / require with a function factory works correctly': function () {
        var appFactory = this.stub(),
            appReturn = 'app module',
            app;
        appFactory.returns(appReturn);
        define('app', [], appFactory);
        app = require('app');
        assert.calledOnce(appFactory);
        assert.equals(app, appReturn);
    },

    'simple define / require with an object factory works correctly': function () {
        var appFactory = {},
            app;
        define('app', [], appFactory);
        app = require('app');
        assert.equals(app, appFactory);
    },

    'dependencies are optional for define': function () {
        var appFactory = this.stub(),
            appReturn = 'app module',
            app;
        appFactory.returns(appReturn);
        define('app', appFactory);
        app = require('app');
        assert.calledOnce(appFactory);
        assert.equals(app, appReturn);
    },

    'require works with a defined module with met dependencies': function () {
        var appFactory = this.spy(),
            utilsFactory = this.spy();
        define('app', ['utils'], appFactory);
        define('utils', utilsFactory);
        require('app');
        assert.calledOnce(appFactory);
        assert.calledOnce(utilsFactory);
    },

    'require accepts array of modules': function () {
        var appFactory = this.spy(),
            utilsFactory = this.spy();
        define('app', appFactory);
        define('utils', utilsFactory);
        require(['app', 'utils']);
        assert.calledOnce(appFactory);
        assert.calledOnce(utilsFactory);
    },

    'array of require modules throws exception for missing module': function () {
        define('app', function () {});
        assert.exception(function () {
            require(['app', 'utils']);
        });
    },

    'array of require modules throws exception for non-string based id': function () {
        define('app', function () {});
        define('utils', function () {});
        define('config', function () {});
        assert.exception(function () {
            require(['app', ['utils', 'config']]);
        });
    },

    'callback is fired when module array resolved, passing modules in as parameters': function () {
        var appFactory = this.stub(),
            appReturn = 'app module',
            utilsFactory = this.stub(),
            utilsReturn = 'utils module',
            callback = this.spy();

        appFactory.returns(appReturn);
        utilsFactory.returns(utilsReturn);

        define('app', appFactory);
        define('utils', utilsFactory);

        require(['app', 'utils'], callback);
        
        assert.calledOnce(callback);
        assert.calledWith(callback, appReturn, utilsReturn);
    },

    'handle with circular references': function () {
        var appFactory = this.stub(),
            appReturn = 'app module',
            utilsFactory = this.stub(),
            utilsReturn = 'utils module',
            callback = this.spy(),
            app;

        appFactory.returns(appReturn);
        utilsFactory.returns(utilsReturn);

        define('app', ['utils'], appFactory);
        define('utils', ['app'], utilsFactory);

        app = require('app');
        
        assert.calledOnce(appFactory);
        assert.calledOnce(utilsFactory);
        assert.equals(app, appReturn);
    }

});