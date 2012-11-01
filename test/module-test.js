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
    }

});