var test = require('tap').test,
    Byway = require('../');

test('match regexes -- beware the crazy escaping!', function(t) {
    var config = [{"pattern": "\\/modules\\/(\\w+)\\/(\\w+).json", "isregex": true}],
        byway = new Byway(config),
        actual = byway.of('abc/modules/mymod/config.json');

    t.ok(actual);
    t.same('abc/modules/mymod/config.json', actual.input);
    t.same(['mymod', 'config'], actual.parts);
    t.same([], actual.param);
    t.end();
});

test('literal regex work, save yourself some backslashes', function(t) {
    var config = [{"pattern": /\/modules\/(\w+)\/(\w+).json$/, "isregex": null}],
        byway = new Byway(config),
        actual = byway.of('abc/modules/mymod/config.json');

    t.ok(actual);
    t.same('abc/modules/mymod/config.json', actual.input);
    t.same(['mymod', 'config'], actual.parts);
    t.same([], actual.param);
    t.end();
});

