"use strict";
var requestToContext = require("./requestToContext");
var FalcorEndpoint = module.exports = {};

FalcorEndpoint.expressMiddleware = function(dataSource) {
    return function(req, reply) {
        var context = requestToContext(req);
        // probably this should be sanity check function?
        if (Object.keys(context).length === 0) {
            return reply.status(500).send("Request not supported");
        }
        if (typeof context.method === "undefined" || context.method.length === 0) {
            return reply.status(500).send("No query method provided");
        }
        if (typeof dataSource[context.method] === "undefined") {
            return reply.status(500).send("Data source does not implement the requested method");
        }
        dataSource[context.method]([].concat(context.path)).subscribe(function(jsong) {
            reply.status(200).send(JSON.stringify(jsong));
        }, function(err) {
            reply.status(500).send(err);
        });
    };
};

