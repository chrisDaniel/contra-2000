game.BadguyRed = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = "BadGuy Red";
        this.chartype = "BadGuy";

        var settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, game.constants.Player_veloYmax);


        //composition
        //delegates for stuff
        this.playerState = new PlayerState(this);
        this.ai = new AISniper(this);
        this.gun = new Gun(this, {reloadTime : 220});
        this.displayHandler = new Display_BadGuyRed(this);
    },

    processDeath : function (bullet) {
        this.playerState.processDeath();
    },

    update : function (dt) {

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

