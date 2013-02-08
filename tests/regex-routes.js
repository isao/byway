var test = require('tape'),
    Byway = require('../');

test('match regexes -- beware the crazy escaping!', function(t) {
    var config = [{"pattern": "\\/modules\\/(\\w+)\\/(\\w+).json", "isregex": true}],
    byway = new Byway(config);

    t.ok(byway.of('abc/modules/mymod/config.json'));
    t.end();
});

test('literal regex work, save yourself some backslashes', function(t) {
    var config = [{"pattern": /\/modules\/(\w+)\/(\w+).json$/, "isregex": null}],
    byway = new Byway(config);

    t.ok(byway.of('abc/modules/mymod/config.json'));
    t.end();
});

