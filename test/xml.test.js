"use strict";
var vows = require("vows"),
	XmlParser = require("../"),
	assert = require("assert"),
	fs = require("fs");

vows.describe("xml path").addBatch({
	simple: {
		topic: function() {
			fs.readFile(
				__dirname + "/simple.xml",
				{ encoding: "utf8" },
				this.callback
			);
		},
		parse: {
			topic: function(dat) {
				var parser = new XmlParser({ strict: true });
				parser.parseString(dat, this.callback);
			},
			caseSenstativePath: function(node) {

				var nodes = node.path(["Envelope", "Body", "GetStockPriceResponse", "Price"]);

				assert.ok(
					nodes.length === 1 &&
					nodes[0].text === "34.5" &&
					nodes[0].getAttribute("includedVat") !== null &&
					nodes[0].getAttribute("includedVat").text === "1.21"
				);
			},
			caseInsenstativePath: function(node) {
				var nodes = node.path(["Envelope", "BoDy", "GetstockpriceResponse", "Price"], true);

				assert.ok(
					nodes.length === 1 &&
					nodes[0].text === "34.5" &&
					nodes[0].getAttribute("includedVat", true) !== null &&
					nodes[0].getAttribute("includedVat", true).text === "1.21"
				);
			},
			invalidPath: function(node) {
				var nodes = node.path(["something", "totally", 'rubbisch'], true);
				assert.ok(nodes.length === 0)
			}
		}
	},
	more: {
		topic: function() {
			fs.readFile(
				__dirname + "/more.xml",
				{ encoding: "utf8" },
				this.callback
			);
		},
		parse: {
			topic: function(dat) {
				var parser = new XmlParser({ strict: true });
				parser.parseString(dat, this.callback);
			},
			caseSenstativePath: function(node) {
				var nodes = node.path(["Envelope", "Body", "GetStockPriceResponse", "Price"]);

				assert.ok(
					nodes.length === 2 &&
					nodes[0].text === "34.5" &&
					nodes[1].text === "35.5"
				);
			},
			caseInsenstativePath: function(node) {
				var nodes = node.path(["Envelope", "BoDy", "GetstockpriceResponse", "Price"], true);

				assert.ok(
					nodes.length === 3 &&
					nodes[0].text === "34.5" &&
					nodes[1].text === "35.5" &&
					nodes[2].text === "36.5"
				);
			},
			invalidPath: function(node) {
				var nodes = node.path(["something", "totally", 'rubbisch'], true);
				assert.ok(nodes.length === 0)
			}
		}
	}
}).export(module);
