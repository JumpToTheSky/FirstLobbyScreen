cc.Class({
    extends: cc.Component,

    properties: {
        buttonListLayout: {
            default: null,
            type: cc.Layout,
        },
        spineBoy: {
            default: null,
            type: sp.Skeleton,
        },
        buttonPrefab: {
            default: null,
            type: cc.Prefab,
        },
        animList: [],
    },

    onLoad() {
        this.animList = this.spineBoy.skeletonData.getRuntimeData().animations;
        console.log("Available animations:", this.animList);
        this.animList.forEach((anim, index) => {
            let buttonNode = cc.instantiate(this.buttonPrefab);
            buttonNode.getComponent(cc.Button).node.on('click', () => {
                this.spineBoy.setAnimation(0, anim.name, false);
            });
            buttonNode.getComponentInChildren(cc.Label).string = anim.name;
            this.buttonListLayout.node.addChild(buttonNode);
        });
    },

});
