/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

var SYMBOLS = /([\/.+(){}\[\]])/g, //escape /.+(){}[] before :name conversions
    NAME_IN = /:(\w+)/g,           //regex to extract :names from patterns
    NAME_RE = '(\\w+)';            //string for :name matching in final regex


function Byway(routes) {
    this.routes = compile(routes);
}

Byway.prototype.of = function(str) {
    return this.routes.some(function checkRoute(route) {
        return route.regex.exec(str) ? route : false;
    });
};

function compile(routes) {
    function perRoute(route) {
        var pattern;
        route.names = []; //todo

        function partnames(ignored, name) {
            route.names.push(name);
            return NAME_RE;
        }

        pattern = route.isregex ? route.pattern :
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_IN, partnames);

        route.regex = new RegExp(pattern, 'i');
    }
    routes.forEach(perRoute);
    return routes;
}

module.exports = Byway;
