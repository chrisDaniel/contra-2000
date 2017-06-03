game.GoodGuyServerNpc = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = this.mpid;
        this.team = config.team;
        this.character  = config.character || game.constants.Character_Lance;
        this.lives = config.startlives || game.constants.Player_startlives;
        this.score = 0;

        //from server
        //variables
        this.serverCommands = [];
        this.serverX = x;
        this.serverY = y;

        // melonjs
        // constructor and setup
        var settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(game.constants.Player_veloXmax, game.constants.Player_veloYmax);


        //composition
        //delegates for stuff
        this.movement = new MovementServerChasing(this);
        this.playerState = new PlayerState(this);
        this.gun = new Gun(this);
        this.displayHandler = new Display_BillLance(this, this.character.sprite_prefix);
    },

    processDeath : function (bullet) {
        this.playerState.forceState({lifecyle : 2});
    },

    applyServerCommands : function (serverCommands){

        this.serverCommands = serverCommands;
        this.serverX = parseInt(serverCommands[3]);
        this.serverY = parseInt(serverCommands[4]);
        this.serverAction = parseInt(serverCommands[8]);
        this.serverAiming = parseInt(serverCommands[9]);
    },

    update : function (dt) {

        this.movement.update(dt);

        this.displayHandler.updateIt(dt);

        this.body.update(dt);

        me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onCollision : function (response, other) {

        switch (other.type){

            case 'platform' :
                return commons.collisions.withPlatformDemo(this, response, other);

            default :
                return false;
        }
    },

    removeIt : function() {
        this.displayHandler.cleanUp();
        me.game.world.removeChild(this);
    },
});

