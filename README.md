[![Build Status](https://travis-ci.org/blackshadev/xmljs.svg?branch=master)](https://travis-ci.org/blackshadev/xmljs)

A small and simple package which can traverse a XML document. Uses sax-js to parse xml.

The goal of the package is a easy way to navigate and search through xml documents. This package makes is easier to extract data from XML documents.

Example:
```js
var XmlParser = require("xmljs");
var fs = require("fs");


var p = new XmlParser({ strict: true });
var xml = fs.readFileSync("./SOAP1.xml"); // XML in the examples direct
var xmlNode = p.parseString(xml, function(err, xmlNode) {
	if(err) {
		console.error(err);
		return;
	}
	var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);
	console.log(nodes.map(function(n) { return n.text; }));
});
```

SOAP1.xml
```xml
<?xml version="1.0"?>
<soap:Envelope
xmlns:soap="http://www.w3.org/2001/12/soap-envelope"
soap:encodingStyle="http://www.w3.org/2001/12/soap-encoding">

  <soap:Body xmlns:m="http://www.example.org/stock">
    <m:GetStockPriceResponse>
      <m:Price>34.5</m:Price>
      <m:Price>30.4</m:Price>
    </m:GetStockPriceResponse>
  </soap:Body>

</soap:Envelope>
```
