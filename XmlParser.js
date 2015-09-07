module.exports = (function () {
	"use strict";
	var $o = require("./core.js");
	var sax = require("sax");

	var parser = $o.Object.extend({
		saxParser: null,
		currentNode: null,
		nodeStack: null, // stack of nodes

		// oPar.strict: Whenever or not to use a strict parser
		// oPar.noTrim : Do not trimtext and comment nodes
		// oPar.noNormalizeWhitespaces: Do not normalize whitespaces in text
		// oPar.lowercaseTagnames: Turn the tagsNames to lowercase
		// oPar.noTracing: Disable position tracing of sax
		// oPar.strictEntities: Allow only predefined entities
		create: function (oPar) {
			this.nodeStack = [];
			this.saxParser = sax.parser(!!oPar.strict, {
				trim: !oPar.noTrim, 
				normalize: !oPar.noNormalizeWhitespaces,
				lowercase: !!oPar.lowercaseTagnames, 
				xmlns: !oPar.noNamespaces, 
				position: !oPar.noTracing, 
				strictEntities: !!oPar.strictEntities
			});
			this.errors = [];
			this.continueOnError = !!oPar.continueOnError;

		
			this._createEvents();
		},

		_createEvents: function() {
			var self = this;
			this.saxParser.onopentag = function (n) {
				var node = new XmlNode(n);
				self.currentNode.addNode(node);
				
				self.pushStack(node);
			};
			this.saxParser.onclosetag = function () {
				self.popStack();
			};
			this.saxParser.onattribute = function (attr) {
				if (attr.prefix === "xmlns") return; // ignore namespace attributes
				self.currentNode.addAttribute(attr);
			};
			this.saxParser.ontext = function (txt) {
				self.currentNode.setText(txt);
			};
			this.saxParser.onerror = function(err) {
				self.errors.push(err);
				if(self.continueOnError)
					self.saxParser.resume();
			};
		},
		parseString: function (str, cb) {
			
			this.nodeStack.length = 0;
			this.errors.length = 0;
			this.root = new Node();
			this.currentNode = this.root;

			this.saxParser.write(str.toString());
			this.saxParser.close();

			var err = this.errors.length === 0 ? null : this.errors;
			cb(err, this.root);

			return this.errors.length === 0;
		},
		pushStack: function(node) {
			this.nodeStack.push(this.currentNode);
			this.currentNode = node;
			
			return node;
		},
		popStack: function() {
			this.currentNode = this.nodeStack.pop();
			return this.currentNode;
		}
	});
	
	// generic node
	var Node = $o.Object.extend({
		children: null,    // dictionary of children nodes
		children_lower: null,
		attributes: null,  // dictionary of attributes
		create: function () {
			this.children = {};
			this.children_lower = {};

			this.attributes = {};
		},
		addAttribute: function(attr) {
			this.attributes[attr.local] = attr.value;
		},
		addNode: function(n) {
			if(!this.children[n.localName])
				this.children[n.localName] = [];
			if(!this.children_lower[n.localName.toLowerCase()])
				this.children_lower[n.localName.toLowerCase()] = [];

			this.children[n.localName].push(n);
			this.children_lower[n.localName.toLowerCase()].push(n);

			return n;
		},
		// TODO doesnt work yet, check example test.js:SOAP1.xml
		path: function(arr, ignoreCase) {
			var nodes = [];

			function next(parNode, left) {

				if(left.length === 0) { nodes.push(parNode); return; }
				var name = left[0];
				var arr = parNode.children[name] || [];
				
				arr.forEach(function(n) { next(n, left.slice(1)); });
			}

			function next_caseinvar(parNode, left) {
				if(left.length === 0) { nodes.push(parNode); return; }
				var name = left[0];
				var arr = parNode.children_lower[name.toLowerCase()] || [];
				
				arr.forEach(function(n) { next_caseinvar(n, left.slice(1)); });
			}

			if(ignoreCase) next_caseinvar(this, arr); else next(this, arr);
			return nodes;
		},
		visit: function(fn) {
			fn(this);
			for(var k in this.children)
				this.children[k].visit(fn);
		}
	});
	
	var XmlNode = Node.extend({
		name: "",
		ns: "",
		prefix: "",
		localName: "",
		text: "",

		_n: null,
		create: function (n) {
			_super(XmlNode).create.call(this);
			this._n = n;

			this.name = n.name;
			this.prefix = n.prefix;
			this.localName = n.local;
			this.ns = n.ns[this.prefix];

		},
		setText: function(txt) {
			this.text = txt;
		}
	});
	
	return parser;
})();