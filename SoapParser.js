module.exports = (function () {
    "use strict";
    var XmlParser = require("./XmlParser.js");

    var parser = XmlParser.extend({
        create: function(oPar) {
            _super(parser).create.call(this, oPar);
        }
    });
    


    return parser;
})();