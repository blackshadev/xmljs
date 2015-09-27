"use strict";
var vows = require("vows"),
    XmlParser = require("../"),
    assert = require("assert"),
    fs = require("fs");

vows.describe("xml path").addBatch({
    simple: {
        topic: function() {
            var parser = new XmlParser({ strict: true });

            var self = this;
            fs.readFile(
                __dirname + "\\simple.xml",
                { encoding: "utf8" },
                function(err, dat) {
                    if(err) throw err;
                    parser.parseString(dat, self.callback);
                }
            );
        },
        caseSenstativePath: function(err, node) {
            if(err)
                throw err;

            var nodes = node.path(["Envelope", "Body", "GetStockPriceResponse", "Price"]);

            assert.ok(
                nodes.length === 1 &&
                nodes[0].text === "34.5" &&
                nodes[0].getAttribute("includedVat") === "1.21"
            );
        },
        caseInsenstativePath: function(err, node) {
            if(err)
                throw err;

            var nodes = node.path(["Envelope", "BoDy", "GetstockpriceResponse", "Price"], true);

            assert.ok(
                nodes.length === 1 &&
                nodes[0].text === "34.5" &&
                nodes[0].getAttribute("Includedvat", true) === "1.21"
            );
        },
        invalidPath: function(err, node) {
            if(err)
                throw err;

            var nodes = node.path(["something", "totally", 'rubbisch'], true);
            assert.ok(nodes.length === 0)
        }
    },
    more: {
        topic: function() {
            var parser = new XmlParser({ strict: true });

            var self = this;
            fs.readFile(
                __dirname + "\\more.xml",
                { encoding: "utf8" },
                function(err, dat) {
                    if(err) throw err;
                    parser.parseString(dat, self.callback);
                }
            );

        },
        caseSenstativePath: function(err, node) {
            if(err) throw err;

            var nodes = node.path(["Envelope", "Body", "GetStockPriceResponse", "Price"]);

            assert.ok(
                nodes.length === 2 &&
                nodes[0].text === "34.5" &&
                nodes[1].text === "35.5"
            );
        },
        caseInsenstativePath: function(err, node) {
            if(err) throw err;

            var nodes = node.path(["Envelope", "BoDy", "GetstockpriceResponse", "Price"], true);

            console.log(nodes);
            assert.ok(
                nodes.length === 3 &&
                nodes[0].text === "34.5" &&
                nodes[1].text === "35.5" &&
                nodes[2].text === "36.5"
            );
        },
        invalidPath: function(err, node) {
            if(err) throw err;

            var nodes = node.path(["something", "totally", 'rubbisch'], true);
            assert.ok(nodes.length === 0)
        }
    }
}).export(module);
