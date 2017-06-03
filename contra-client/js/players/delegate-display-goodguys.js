

function Display_BillLance(player, spriteName){

    this.player = player;

    var sn = spriteName || game.constants.Character_Bill.sprite_prefix;

    var animationmap = [
        {name : "idle",     frames : [5]},
        {name : "shooting", frames : [5, 6]},
        {name : "walk",     frames : [26, 27, 28, 29, 30]},
        {name : "jump",     frames : [37, 38, 39, 40]},
        {name : "duck",     frames : [36]},
        {name : "aimup",    frames : [8]},
        {name : "aimdownwalk",  frames : [18, 19, 20]},
        {name : "aimupwalk",    frames : [12, 13, 14]},
        {name : "dying",        frames : [46, 47, 48, 49, 50], delay : 500},
        {name : "dead",         frames : [50]}
    ];

    this.player.renderable = commons.me.textureSpriteHelper(game.texture.goodguys, sn, animationmap);
    this.player.renderable.setCurrentAnimation('idle');

    this.highlight = new HL_PlayerWithReload(this.player);
    this.highlight.show();

    this.updateIt = function(dt) {

        var directionFacing = this.player.playerState.direction;
        (directionFacing == -1) ? this.player.renderable.flipX(true) : this.player.renderable.flipX(false);

        var lifecycle = this.player.playerState.lifecycle;
        var action = this.player.playerState.activity;
        var aiming = this.player.playerState.aiming;

        //spawning
        if(lifecycle == 0){
            this.update_Sprite('jump');
            return;
        }
        //dying
        if(lifecycle == 2 || lifecycle == 3){

            if (!this.player.renderable.isCurrentAnimation('dying')) {
                var that = this;
                this.player.renderable.setCurrentAnimation('dying', e => that.update_Sprite('dead'));
            }
            return;
        }
        //dead
        if(lifecycle == 3){
            this.update_Sprite('dead');
            return;
        }

        //otherwise switch on current action
        switch (action) {

            //idle
            case 0 :
                this.update_Sprite('idle');
                break;

            //jumping ... falling
            case 1 :
            case 6 :
                this.update_Sprite('jump');
                break;

            //running
            case 2:
                //aim horizontal
                if (this.player.playerState.getFlagTimer("shooting") < 250) {
                    this.update_Sprite('shooting');
                }
                else if (aiming == 1) {
                    this.update_Sprite('walk');
                }
                else if (aiming == 2) {
                    this.update_Sprite('aimupwalk')
                }
                else if (aiming == 4) {
                    this.update_Sprite('aimdownwalk')
                }
                break;

            //ducking
            case 3:
                this.update_Sprite('duck');
                break;

            //looking up
            case 4:
                this.update_Sprite('aimup');
                break;

            //dropping down
            case 5:
                this.update_Sprite('idle');
                break;

            default :
                if (this.player.playerState.getFlagTimer("shooting") < 250) {
                    this.update_Sprite('shooting');
                }
                else {
                    this.update_Sprite('idle');
                }
        }
        this.player.renderable.update(dt);
    };
    this.update_Sprite = function(toState, f) {

        if (this.player.renderable.isCurrentAnimation(toState)) {
            return;
        }
        if(f){
            this.player.renderable.setCurrentAnimation(toState, f);
        }
        else{
            this.player.renderable.setCurrentAnimation(toState);
        }
    };

    this.cleanUp = function(){
        this.highlight && this.highlight.hide();
    };
}



