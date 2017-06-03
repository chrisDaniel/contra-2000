game.GoodGuyBill = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = this.mpid;
        this.team = config.team;
        this.character  = config.character || game.constants.Character_Bill;
        this.chartype = "GoodGuy";
        this.lives = config.startlives || game.constants.Player_startlives;
        this.score = 0;


        // melonjs
        // constructor and setup
        this.settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };

        this._super(me.Entity, 'init', [x, y, this.settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(game.constants.Player_veloXmax, game.constants.Player_veloYmax);


        //composition
        //delegates for stuff
        this.movement = new MovementInput(this);
        this.playerState = new PlayerState(this);
        this.gun = new Gun(this);
        this.displayHandler = new Display_BillLance(this, this.character.sprite_prefix);
    },

    processDeath : function (bullet) {
        this.playerState.forceState({lifecycle : 2});
    },

    update : function (dt) {

        this.movement.update(dt);

        me.input.isKeyPressed('shoot') ? this.gun.fire(dt) : this.gun.idle(dt);

        this.displayHandler.updateIt(dt);

        this.body.update(dt);

        me.collision.check(this);

        game.manager.postPlayerUpdate(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onCollision : function (response, other) {

        switch (other.type){

            case 'platform' :
                return commons.collisions.withPlatformDemo(this, response, other);

            case 'runbot' :
                if(commons.collisions.withBadguy(this,response, other)){
                    game.manager.postDamage(this, other);
                }
                return false;

            case 'bullet' :
                if(commons.collisions.withBullet(this, response, other)) {
                    game.manager.postDamage(this, other);
                }
                return false;


            default :
                return false;
        }
    }
});

