buster.testCase('Module Usage', {

    tearDown: function () {
        require.reset();
    },

    'require an array of independant modules with a callback': function () {

        define('a', function () { return '(a)'; });
        define('b', function () { return '(b)'; });
        define('c', function () { return '(c)'; });

        var result = require(['a', 'b', 'c'], function (a, b, c) {
            return a + b + c;
        });

        assert.equals(result, "(a)(b)(c)");

    },

    'require an array of independant modules without a callback': function () {
        
        define('a', function () { return '(a)'; });
        define('b', function () { return '(b)'; });
        define('c', function () { return '(c)'; });

        assert.equals(require(['a', 'b', 'c']), ["(a)", "(b)", "(c)"]);

    },

    'multiple duplicate dependencies are resolved to the same module': function () {
        define('a', ['b', 'b', 'b'], function (b, c, d) { return '(a)' + b + c + d; });
        define('b', function () { return '(b)'; });
        assert.equals(require('a'), "(a)(b)(b)(b)");
    },

    'mirrored circular dependency resolves the correctly': function () {
        define('a', ['b'], function (b) { return '(a - ' + b + ')'; });
        define('b', ['a'], function (a) { return '(b - ' + a + ')'; });
        assert.equals(require('a'), "(a - (b - undefined))");
    },

    'linear chained circular dependency resolves correctly': function () {
        define('a', ['b'], function (b) { return '(a - ' + b + ')'; });
        define('b', ['c'], function (c) { return '(b - ' + c + ')'; });
        define('c', ['a'], function (a) { return '(c - ' + a + ')'; });
        assert.equals(require('a'), "(a - (b - (c - undefined)))");
    },

    'linear nested circular dependency resolves correctly': function () {
        define('a', ['b', 'c'], function (b, c) { return '(a - ' + b + ' - ' + c + ')'; });
        define('b', function () { return '(b)'; });
        define('c', ['a'], function (a) { return '(c - ' + a + ')'; });
        assert.equals(require('a'), "(a - (b) - (c - undefined))");
    },

    'linear nested mid-require circular dependency resolves correctly': function () {
        define('a', ['b', 'c'], function (b, c) { return '(a - ' + b + ' - ' + c + ')'; });
        define('b', ['a'], function (a) { return '(b - ' + a + ')'; });
        define('c', function () { return '(c)'; });
        assert.equals(require('a'), "(a - (b - undefined) - (c))");
    },

    'consecutive require calls for modules with circular dependencies': function () {
        define('a', ['b', 'c'], function (b, c) { return '(a - ' + b + ' - ' + c + ')'; });
        define('b', ['a'], function (a) { return '(b - ' + a + ')'; });
        define('c', function () { return '(c)'; });
        assert.equals(require('a'), '(a - (b - undefined) - (c))');
        assert.equals(require('b'), '(b - undefined)');
    }

});