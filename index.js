/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

var SYMBOLS = /([\/.+(){}\[\]])/g, //escape /.+(){}[] before :name conversions
    NAME_IN = /:(\w+)/g,           //for extracting :names from patterns
    NAME_RE = '(\\w+)';            //for final regex in place of :names


function makeout(names, vals) {
    var out;
    if(names.length) {
        out = {};
        names.forEach(function copy(name, i) {
            out[name] = vals[i];
        });
    } else { //no names, so pattern was a regex-route
        out = vals.slice(0);
    }
    return out;
}

function namer(route) {
    var pattern = route.pattern.replace(SYMBOLS, '\\$1');
    function partnamer(ignored, name) {
        route.names.push(name);
        return NAME_RE;
    }
    return pattern.replace(NAME_IN, partnamer);
}

function regexify(route) {
    var pattern = route.pattern;
    route.names = []; //capture names; empty array signifies regex-route
    if(pattern instanceof RegExp) { //possible pattern values:
        route.regex = pattern;      // 1. literal RegExp
                                    // 2. regex-route string
    } else {                        // 3. name-route string
        route.regex = new RegExp(route.isregex ? pattern : namer(route), 'i');
    }
}

function compile(routes) {
    routes.forEach(regexify);
    return routes;
}

function Byway(routes) {
    this.routes = compile(routes);
}

Byway.prototype.of = function(str) {
    var found = false;
    function checkRoute(route) {
        found = route.regex.exec(str);
        if(found) {
            found = {
                'input': found.input,
                'param': route.param || [],
                'parts': makeout(route.names, found.slice(1))
            };
            return true;
        }
    }
    this.routes.some(checkRoute);
    return found;
};

module.exports = Byway;
