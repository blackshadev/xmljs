var XmlParser = require("./XmlParser.js");
var fs = require("fs");


var p = new XmlParser({ strict: true });
var xml = fs.readFileSync("./SOAP1.xml");
var xmlNode = p.parse(xml);

var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);
console.log(nodes.map(function(n) { return n.text; }));