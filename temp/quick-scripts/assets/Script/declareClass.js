(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/declareClass.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'babactSHEBKupE7U2QNQYkA', 'declareClass', __filename);
// Script/declareClass.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        userID: 20,
        userName: "Nguyễn"
    },

    start: function start() {}
});

var mObject = cc.Class({
    name: "mObject",
    ctor: function ctor() {
        cc.log('Construct');
    },
    test: function test() {
        cc.log('test');
    }
});
var mBigObject = cc.Class({
    extends: mObject
});
var Shape = cc.Class({
    ctor: function ctor() {
        cc.log("Shape");
    }

});
var Rect = cc.Class({
    extends: Shape,
    properties: {
        height: 20,
        type: "actor",
        loaded: false,
        target: null
    }
});
var Square = cc.Class({
    extends: Rectf,
    ctor: function ctor() {
        cc.log("Square");
    },
    properties: {
        any: [],
        bools: [cc.Boolean],
        strings: [cc.String],
        floats: [cc.Float],
        ints: [cc.Integer],
        values: [cc.Vec2],
        nodes: [cc.Node],
        frames: [cc.SpriteFrame]
    }
});

var Soccer = cc.Class({
    extends: Square,
    ctor: function ctor() {
        cc.log("Soccer");
    },
    properties: {
        score: {
            default: 0,
            displayName: "Score (player)",
            tooltip: "The score of player"
        },
        names: {
            default: [],
            type: [cc.String] // use type to specify that each element in array must be type string
        },
        enemies: {
            default: [],
            type: [cc.Node] // type can also be defined as an array to improve readability
        },
        width: {
            get: function get() {
                return this._width;
            },
            set: function set(value) {
                this._width = value;
            }
        }
    }
});
var square = new Square();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=declareClass.js.map
        