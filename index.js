/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

var SYMBOLS = /([.+*(){}\[\]\/])/g, //escape .+*(){}[]/ in name patterns
    NAME_ID = /([:•])(\w+)/g,       //extract :names or *names from patterns
    NAME_RE = '([\\w.-]+)',         //for final regex, to use in place of :names
    SPOT_RE = '(\\S+)';             //for final regex, to use in place of •names


function makeout(names, vals) {
    var out;
    if(names.length) {
        out = {};
        names.forEach(function combine(name, i) {
            out[name] = vals[i];
        });
    } else { //no names, so pattern was a regex-route; empty array if no parens
        out = vals;
    }
    return out;
}

//convert name-route to RegExp, accumulate names to recombine later w/makeout
function namer(nameroute, names) {
    var pattern = nameroute.replace(SYMBOLS, '\\$1');
    function partnamer(ignored, colon_or_spot, name) {
        names.push(name);
        return colon_or_spot === ':' ? NAME_RE : SPOT_RE;
    }
    return pattern.replace(NAME_ID, partnamer);
}

function regexify(pattern, isregex, names) {
    return pattern instanceof RegExp ?
        //possible pattern values:
        // 1. RegExp, 2. regex string, or 3. name-route string
        pattern : new RegExp(isregex ? pattern : namer(pattern, names), 'i');
}

function compile(route) {
    var names = [],
        regex = regexify(route.pattern, route.isregex, names);

    return {
        names: names,
        regex: regex,
        param: route.param || []
    };
}

function Byway(routes) {
    this.routes = routes.map(compile);
}

Byway.prototype.of = function(str) {
    var found = false;
    function checkRoute(route) {
        found = route.regex.exec(str);
        if(found) {
            found = {
                'input': found.input,
                'param': route.param,
                'parts': makeout(route.names, found.slice(1))
            };
            return true;
        }
    }
    this.routes.some(checkRoute);
    return found;
};

module.exports = Byway;
