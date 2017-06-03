

var HL_PlayerWithReload = me.Renderable.extend({

    init : function (target){

        this.target = target;
        this.teamColor = commons.game.getColorForTeam(target.team);
        this._super(me.Renderable, "init", [target.pos.x, target.pos.y, target.width, target.height]);
    },

    show : function () {
        if (!this.visible) {
            me.game.world.addChild(this, 4);
            this.visible = true;
            me.game.repaint();
        }
    },
    hide : function () {
        if (this.visible) {
            me.game.world.removeChild(this, true);
            this.visible = false;
            me.game.repaint();
        }
    },
    destroy : function () {},

    draw : function (renderer) {

        var arcRad = this.target.gun ? (6.28 * this.target.gun.reloadPerc) : 0;

        var center = this.target.playerState.calcCenterPosition(this.target.pos.x, this.target.pos.y) || [0,0];
        var posX = this.target.pos.x;
        var posY = center[1] - .5 * this.target.height;

        var color = renderer.getColor();

        renderer.setGlobalAlpha(.4);
        renderer.setColor(this.teamColor);
        renderer.fillArc(posX, posY, this.target.width/2, 0, 6.28);

        renderer.setGlobalAlpha(1);
        renderer.setColor('#FFFFFF');
        renderer.strokeArc(posX, posY, this.target.width/2, 0, arcRad);

        renderer.setGlobalAlpha(1);
        renderer.setColor(color);
    },

    update : function (time) {
        return this.visible;
    }
});
