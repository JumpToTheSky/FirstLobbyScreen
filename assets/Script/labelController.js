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

    start () {
        if (this.labelComponent) { 
            this.labelComponent.string = "Chào từ script labelController!";
            this.labelComponent.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.labelComponent.node.width = this.maxWidthForLabel;
            this.lblHello.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
            this.lblHello.verticalAlign = cc.Label.VerticalAlign.TOP;
        }
    },
    testFunc() {
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

