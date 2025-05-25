cc.Class({
    extends: cc.Component,

    properties: {
        //rankLabel: cc.Label,
        nameLabel: cc.Label,
        levelLabel: cc.Label,
        powerLabel: cc.Label,
        // countrySprite: cc.Sprite,
    },
    updateData(playerData, rank) {
        if (this.rankLabel) {
            this.rankLabel.string = (rank + 1).toString() + ".";
        }
        if (this.nameLabel) {
            this.nameLabel.string = playerData.name || "N/A";
        }
        if (this.levelLabel) {
            this.levelLabel.string = "Lv. " + (playerData.level || "N/A");
        }
        if (this.powerLabel) {
            this.powerLabel.string = "LC: " + (playerData.power || "0").toLocaleString();
        }

        this.node.active = true; 
    },

});
