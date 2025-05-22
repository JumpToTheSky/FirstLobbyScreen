(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/labelController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '23de5yYVDZLUaVNB1ikOo1r', 'labelController', __filename);
// Script/labelController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        labelComponent: {
            default: null,
            type: cc.Label
        },
        maxWidthForLabel: {
            default: 180,
            type: cc.Float,
            tooltip: "Chiều rộng tối đa của Label trước khi văn bản xuống dòng"
        }

    },

    start: function start() {
        if (this.labelComponent) {
            this.labelComponent.string = "Chào từ script labelController!";
            this.labelComponent.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.labelComponent.node.width = this.maxWidthForLabel;
            this.lblHello.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
            this.lblHello.verticalAlign = cc.Label.VerticalAlign.TOP;
        }
    },
    testFunc: function testFunc() {
        var node = this.node;
        node.x = 100;
        var label = this.node.getComponent(cc.Label);
        var text = this.name + ' started';

        label.string = text;

        var helloComp = this.node.getComponent('say-hello');

        var label1 = this.getComponent(cc.Label);
        if (label1) {
            label1.string = "Hello";
        } else {
            cc.error("Something wrong?");
        }
    }
});

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
        //# sourceMappingURL=labelController.js.map
        