cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad() {
        this.node.active = false;
        this.node.setPosition(800, Math.random() * 401 - 200);
    },
    randomLineStart() {
        let startLine = Math.floor(Math.random() * 3);
        if (startLine === 0) {
            return cc.v2(800, 200);
        } else if (startLine === 1) {
            return cc.v2(800, 0);
        } else {
            return cc.v2(800, -200);
        }
    },

    delaySpawn(interval = 0) {
        this.scheduleOnce(() => {
            this.node.active = true;
        }, interval);
    },

    update(dt) {
        this.node.x -= 250 * dt;
        if (this.node.x < -900) {
            console.log(this.node.name + " has been destroyed");
            this.node.destroy();
        }
    }
});
