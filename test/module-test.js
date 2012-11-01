buster.testCase('Module', {

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

    'simple define / require works correctly': function () {
        var appFactory = this.spy();
        define('app', [], appFactory);
        require('app');
        assert.calledOnce(appFactory);
    },

    'dependencies are optional for define': function () {
        var appFactory = this.spy();
        define('app', appFactory);
        require('app');
        assert.calledOnce(appFactory);
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

    '//deal with circular references': function () {}

});