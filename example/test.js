var XmlParser = require("../");
var fs = require("fs");


var p = new XmlParser({ strict: true });
var xml = fs.readFileSync("./example/SOAP1.xml");
var xmlNode = p.parse(xml);

var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);
// console.log(nodes);
console.log(nodes.map(function(n) { return n.text; }));