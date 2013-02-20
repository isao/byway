var test = require('tape'),
    Byway = require('../');


test('instantiating w/ a non-array throws', function(t) {

    t.throws(function() {
        byway = new Byway({});
    });

    t.throws(function() {
        byway = new Byway(null);
    });

    t.throws(function() {
        byway = new Byway(111111);
    });

    t.end();
});


test('instantiating without valid patterns throws', function(t) {
    var config = [
        {}, {pattern:null}, {pattern:0}, {pattern:-0}, {pattern:false}
    ];

    function thrower() {
        byway = new Byway(config);
    }

    t.throws(thrower);
    t.end();
});
