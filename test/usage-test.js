buster.testCase('Module Usage', {

    tearDown: function () {
        require.reset();
    },

    'require an array of individual modules with a callback': function () {

        define('a', function () { return '(a)'; });
        define('b', function () { return '(b)'; });
        define('c', function () { return '(c)'; });

        var result = require(['a', 'b', 'c'], function (a, b, c) {
            return a + b + c;
        });

        assert.equals(result, "(a)(b)(c)");

    }

});