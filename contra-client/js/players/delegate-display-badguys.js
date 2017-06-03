
function Display_BadGuyRed(player, spriteName){

    this.player = player;
    var sn = spriteName || "BadGuys";

    var animationmap = [
        {name : "horiz",    frames : [2, 3]},
        {name : "up",       frames : [4, 5]},
        {name : "down",     frames : [1]},
    ];

    this.player.renderable = commons.me.textureSpriteHelper(game.texture.badguys, sn, animationmap);
    this.player.renderable.setCurrentAnimation('horiz');

    this.updateIt = function(dt) {

        this.player.playerState.direction >= 0 ? this.player.renderable.flipX(false) : this.player.renderable.flipX(true);

        switch(this.player.playerState.aiming ) {

            //aim horizontal
            case 1 :
                this.update_Sprite('horiz');
                break;

            //aim up
            case 2 :
            case 3 :
                this.update_Sprite('up');
                break;

            //aim down
            case 4 :
            case 5 :
                this.update_Sprite('down');
                break;
        }
    };
    this.update_Sprite = function(toState) {
        if (!this.player.renderable.isCurrentAnimation(toState)) {
            this.player.renderable.setCurrentAnimation(toState);
        }
    };
}


function Display_BadGuyRunbot(player, spriteName) {

    this.player = player;
    var sn = spriteName || "BadGuys";

    var animationmap = [
        {name: "run", frames: [17, 18, 19, 20, 21, 22]},
    ];

    this.player.renderable = commons.me.textureSpriteHelper(game.texture.badguys, sn, animationmap);
    this.player.renderable.setCurrentAnimation('run');

    this.updateIt = function (dt) {
        this.player.playerState.direction >= 0 ? this.player.renderable.flipX(false) : this.player.renderable.flipX(true);
    }
}
