module.exports = (function () {
    "use strict";
    var $o = {};
    $o.Object = function () { };
    $o.Object.prototype.create = function () { };
    $o.Object.prototype.destroy = function() { };
    $o.Object.prototype.superClass = null;
    $o.Object.prototype.toString = function () { return "[Object]"; };

    $o.Object.override = function (procname, fn) {
        this.prototype[procname] = fn;
        fn.$inherited = this.prototype.superClass;
    };

    GLOBAL._super = function (classDef) {
        return classDef.prototype.__proto__;
    };

    $o.Object.extend = function (def) {
        var classDef = function () { 
            if (arguments[0] !== $o.Object) { this.create.apply(this, arguments); } };
        var proto = new this($o.Object);
        var superClass = this.prototype;
        proto.superClass = superClass;
        for (var n in def) {
            proto[n] = def[n];
        }
        
        proto.classDef = classDef;
        classDef.prototype = proto;
        //Give this new class the same static extend method
        classDef.extend = this.extend;
        classDef.override = $o.Object.override;
        classDef.properties = this.properties ? this.properties.clone() : undefined;
        return classDef;
    };

    /* List object */
    $o.List = $o.Object.extend({
        itemsArray: null, // array with all items
        items: null, // object with all items, with as key the ndxField within the object
        ndxField: "id", // index field used for the key in the items object
        itemClass: $o.Object, // item instance to accept
        destroyElements: true,
        create: function(oPar) {
            this.itemsArray = [];
            this.items = {};

            $o.extend(this, oPar);
        },
        /* Adds a item */
        add: function(item, idx) {
            if(!(item instanceof this.itemClass) )
                throw "Given item not of correct intstance";

            if(idx === undefined)
                idx = item[this.ndxField];
            if(idx === undefined)
                throw "Given item has no needed index field";

            if(this.items[idx] !== undefined)
                throw "Given item has an index field that already is present in list";

            this.items[idx] = item;
            this.itemsArray.push(item);

            return this;
        },
        forEach: function(fn) {
            var len = this.itemsArray.length;
            for(var i = 0; i < len; i++)
                fn(this.itemsArray[i], i, this);

            return this;
        },
        /* if fn returns the given bool (as boolean), the loop wil terminate */
        forEachB: function(fn, bool) {
            var len = this.itemsArray.length;
            for(var i = 0; i < len; i++)
                if(fn(this.itemsArray[i], i, this) !== !bool) return this;
        },
        clear: function() {
            if(this.destroyElements)
                this.forEach(function(el) { el.destroy(); });
            this.itemsArray.length = 0;
            this.items = {};
            return this;
        },
        destroy: function() {
            this.clear();
        },
        set: function(arr) {
            this.clear();

            if(!arr) return;
            for(var iX = 0; iX < arr.length; iX++) {
                this.add(arr[iX]);
            }
        },
        join: function(fn) {
            return this.itemsArray.join(fn);
        },
        map: function(fn) {
            return this.itemsArray.map(fn);
        },
        search: function(fn) {
            var row;
            this.forEachB(function(el) {
                if(fn(el)) { row = el; return false; }
            });
            return row;
        },
        /* Returns the first value of the function which translates to truely */
        has: function(fn) {
            var has = undefined;
            this.forEachB(function(el) {
                var retr = fn(el);
                if(retr !== undefined) { has = retr; return false; }
            });

            return has;
        },
        indexOf: function(obj) {
            return this.itemsArray.indexOf(obj);
        },
        filterOne: function(fn) {
            var val = null;
            this.forEachB(function(el) {
                var retr = fn(el);
                if(retr !== false && retr !== null && retr !== undefined) { 
                    val = el; return false; 
                }
            });

            return val;
        }
    });


    Object.keys = function(o) {
        var arr = [];
        for(var k in o) arr.push(k);
        return arr;
    };

    $o.extend = function(a, b) {
        for (var k in b) a[k] = b[k];

        return a;
    };

    return $o;
})();
