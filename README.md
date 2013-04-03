byway [![Build Status](https://travis-ci.org/isao/byway.png)](https://travis-ci.org/isao/byway)
=====
Match a string by sinatra/express style named-params, or regexes, and get something back.

install
-------
    npm i --save byway

usage
-----
Starting with:

    var Byway = require('byway'),
        routes = require('someroutes'), //json, or js, that exports an array of objects
        byway = new Byway(routes);

Here the value of `routes` is an array of objects, with the following properties:

* `pattern` - *required* string to convert to a regular expression, or a literal RegExp
* `isregex` - *optional* true if `pattern` is a string you want to convert to a regex
* `param` - *optional* anything; this is returned as part of a match, if truthy.

Once you've created a `byway` object, determine if a string matches any of the `routes.pattern`s like:

    var match = byway.of(some_string);

If `some_string` wasn't matched by any `routes.pattern`s `match` is false. Otherwise, the return value is an object with the following properties:

* `input` - the original string that was passed to of()
* `param` - the value of the param property defined in the corresponding route
* `parts` - an object with key/value pairs corresponding to the matched named patterns, or an array containing the text captured by your regex subpatterns, if any.

See [`tests/examples.js`](tests/examples.js).

### named patterns

    foo/bar/:somedir/booyah/:afile.:extension

n.b. unachored.

### named spot patterns

named spot patterns do a non-greedy match for any characters within the p

    foo/•subpath/:afile.:extension

### regex patterns

can either be strings (be carefull to escape backslashes for the string and regex) or literal javascript RegExp objects.


test
----
    npm test

Tests use Isaac Schlueter's [tap](https://github.com/isaacs/node-tap) test harness. If you have Krishnan Anantheswaran's [istanbul](https://github.com/gotwarlost/istanbul/), or Jarrod Overson's [plato](https://github.com/jsoverson/plato) installed globally you can do these things too, respectively:

    npm run-script cover
    npm run-script plato

license
-------
MIT, see LICENSE.txt.
