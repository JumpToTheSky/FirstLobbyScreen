cc.Class({
    extends: cc.Component,

    properties: {
        userID: 20,
        userName: "Nguyễn"
    },

    start() {

    },
});

var mObject = cc.Class({
    name: "mObject",
    ctor() {
        cc.log('Construct');
    },
    test() {
        cc.log('test');
    }
});
var mBigObject = cc.Class({
    extends: mObject
});
var Shape = cc.Class({
    ctor: function () {
        cc.log("Shape");
    }

});
var Rect = cc.Class({
    extends: Shape,
    properties: {
        height: 20,
        type: "actor",
        loaded: false,
        target: null,
    }
});
var Square = cc.Class({
    extends: Rectf,
    ctor: function () {
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
        frames: [cc.SpriteFrame],
    }
});

var Soccer = cc.Class({
    extends: Square,
    ctor: function () {
        cc.log("Soccer");
    },
    properties: {
        score: {
            default: 0,
            displayName: "Score (player)",
            tooltip: "The score of player",
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
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            }
        }
    }
});
var square = new Square();