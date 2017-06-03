game.BadguyRunbot = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = "Run Robot";
        this.chartype = "BadGuy";

        var settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(game.constants.Player_veloXmax * 1.3, game.constants.Player_veloYmax);

        this.type = "runbot";

        //composition
        //delegates for stuff
        this.playerState = new PlayerState(this);
        this.ai = new AIRunner(this);
        this.displayHandler = new Display_BadGuyRunbot(this);
    },

    processDeath : function (bullet) {
        this.playerState.processDeath();
    },

    update : function (dt) {

        if (this.pos.y > me.game.viewport.height) {
            return this.removeIt();
        }
        else if(this.pos.x > me.game.viewport.width || this.pos.x < 0){
            return this.removeIt();
        }


        this.ai.updateIt(dt);
        this.displayHandler.updateIt(dt);

        this.body.update(dt);
        me.collision.check(this);

        return this._super(me.Entity, 'update', [dt]) || true;
    },

    onCollision : function (response, other) {

        switch (other.type){

            case 'platform' :
                return commons.collisions.withPlatformDemo(this, response, other);

            case 'bullet' :
                if(other.pid != game.manager.gameState.fpu.mpid){
                    return false;
                }
                if(commons.collisions.withBullet(this, response, other)) {
                    game.manager.postDamage(this, other);
                    return true;
                }
                return false;


            default :
                return false;
        }
    },
    removeIt : function() {
        me.game.world.removeChild(this);
        return false;
    },
});

