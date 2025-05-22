"use strict";
cc._RF.push(module, '23de5yYVDZLUaVNB1ikOo1r', 'labelController');
// Script/labelController.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        labelComponent: {
            default: null,
            type: cc.Label
        }

    },

    start: function start() {
        if (this.labelComponent) {
            this.labelComponent.string = "Chào từ script Say-Hello!";
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