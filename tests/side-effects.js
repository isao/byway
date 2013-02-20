var test = require('tape'),
    Byway = require('../');


test('fixed: input patterns do not get changed by reference', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        expected = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        byway =  new Byway(config);

    t.same(config, expected);
    t.end();
});

test('fixme? input params can get changed by reference', function(t) {
    var config = [{
            "pattern": "/mojits/:mojitname/:controller.:affinity.js",
            "param": [1,2,3]
        }],
        expected = [{
            "pattern": "/mojits/:mojitname/:controller.:affinity.js",
            "param": [1,2,3]
        }],
        actual,
        byway =  new Byway(config);

    t.same(config, expected);
    config[0].param[0] = 99;
    t.notSame(config, expected);

    actual = byway.of('/mojits/mofo/mojo.mijo.js').param;
    t.notSame(actual, expected[0].param);
    t.equal(99, actual[0]);
    t.end();
});
