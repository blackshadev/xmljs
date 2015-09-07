var XmlParser = require("../");
var fs = require("fs");


var p = new XmlParser({ strict: true });
var xml = fs.readFileSync("./example/SOAP1.xml");
var xmlNode = p.parseString(xml, function(err, xmlNode) {
	if(err) {
		console.error(err);
		return;
	}
	var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);	
	console.log(nodes.map(function(n) { return n.text; }));
});
