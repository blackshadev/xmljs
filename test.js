var XmlParser = require("./XmlParser.js");
var fs = require("fs");


var p = new XmlParser({ strict: true });
var xml = fs.readFileSync("./SOAP1.xml");
var xmlNode = p.parse(xml);

console.log(xmlNode.path(["Envelope", "Body", "GetStockPriceResponse", "Price"]));