buster.testCase('Module', {

    'define and require functions exist': function () {
        assert.isFunction(define);
        assert.isFunction(require);
    }

});