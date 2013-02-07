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
                'parts': parts(route.names, found.slice(1))
            };
            return true;
        }
    }

    this.routes.some(checkRoute);
    return found;
};

function parts(names, vals) {
    var out;
    if(names.length) {
        out = {};
        names.forEach(function copy(name, i) {
            out[name] = vals[i];
        });
    } else { //pattern was a regex, so no names
        out = vals.slice(0);
    }

    return out;
}

function compile(routes) {
    function perRoute(route) {
        var pattern;

        route.names = [];
        function partnamer(ignored, name) {
            route.names.push(name);
            return NAME_RE;
        }

        pattern = route.isregex ? route.pattern :
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_IN, partnamer);

        route.regex = new RegExp(pattern, 'i');
    }
    routes.forEach(perRoute);
    return routes;
}

module.exports = Byway;
