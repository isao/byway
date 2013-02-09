var test = require('tape'),
    Byway = require('../');


test('configs passed to contructor get changed by reference', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        expected = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        byway =  new Byway(config);

    //fix this?
    t.notSame(config, expected);
    t.end();
});
