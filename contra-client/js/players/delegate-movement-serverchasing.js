
function MovementServerChasing(player){

    this.player = player;
    this.input = new PlayerInput();

    this.update = function (dt) {

        this.update_mockInput(dt);
        this.player.playerState.giveInput(this.input);
        this.player.playerState.updateIt(dt);

        var dA = this.player.playerState.calcAccelFactor() || [0,0];

        this.player.body.vel.x = dA[0] * this.player.body.accel.x * me.timer.tick;

        if(dA[1] < 0) {
            this.player.body.vel.y = dA[1] * this.player.body.maxVel.y * me.timer.tick;
            this.player.body.jumping = true;
        }

        //special case handlers
        /*if(this.player.pos.y > this.player.serverY && this.player.body.falling){
            this.player.body.pos.y = this.player.serverY;
        }*/
    };
    this.update_mockInput = function(dt) {

        this.input.clearInput();

        var dx = this.player.serverX - this.player.pos.x;    //if > 0 ... need to go right
        var dy = this.player.pos.y - this.player.serverY;    //if > 0 ... need to jump

        //Step...
        //Figure out if we need to press left/right
        if(dx > -1 && dx < 1){
            this.player.pos.x = this.player.serverX;
        }
        else if(dx >= 1){
            this.input.right = 1;
        }
        else if(dx <= -1){
            this.input.left = 1;
        }

        //Step...
        //Figure out if we need to jump
        if(dy > -1 && dy < 1){
            this.player.pos.y = this.player.serverY;
        }
        else if(dy > 4){
            this.input.jump = 1;
        }
    };
}
   
