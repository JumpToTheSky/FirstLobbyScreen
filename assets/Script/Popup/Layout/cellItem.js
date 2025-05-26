cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: cc.Label,
        nameLabel: cc.Label,
        levelLabel: cc.Label,
        powerLabel: cc.Label,
        iconBronze: cc.Node,
        iconSilver: cc.Node,
        iconGold: cc.Node,
        ribbon: cc.Node,

        // countrySprite: cc.Sprite,
    },
    updateData(playerData, rank) {
        if (this.ribbon) this.ribbon.active = false;
        if (this.iconGold) this.iconGold.active = false;
        if (this.iconSilver) this.iconSilver.active = false;    
        if (this.iconBronze) this.iconBronze.active = false;

        if (this.rankLabel) {
            this.rankLabel.string = (rank + 1).toString() + ".";
            this.rankLabel.width = 130;

            if (rank === 0) {
                this.ribbon.active = true;
                this.iconGold.active = true;
            } else if (rank === 1) {
                this.iconSilver.active = true;
            } else if (rank === 2) {
                this.iconBronze.active = true;
            }
        }
        if (this.nameLabel) {
            this.nameLabel.string = playerData.name || "N/A";
            this.nameLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        }
        if (this.levelLabel) {
            this.levelLabel.string = "Lv. " + (playerData.level || "N/A");
        }
        if (this.powerLabel) {
            this.powerLabel.string = "LC: " + (playerData.power || "0").toLocaleString();
            this.powerLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        }
        this.node.active = true;
    },

});
