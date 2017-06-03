
function MovementInput(player){

    this.player = player;
    this.input = new PlayerInput();

    this.update = function (dt) {

        this.input.jump   = me.input.isKeyPressed('jump') ? 1 : 0;
        this.input.left   = me.input.isKeyPressed('left') ? 1 : 0;
        this.input.right  = me.input.isKeyPressed('right') ? 1 : 0;
        this.input.up     = me.input.isKeyPressed('up') ? 1 : 0;
        this.input.down   = me.input.isKeyPressed('down') ? 1 : 0;

        this.player.playerState.giveInput(this.input);
        this.player.playerState.updateIt(dt);

        var dA = this.player.playerState.calcAccelFactor() || [0,0];

        this.player.body.vel.x = dA[0] * this.player.body.accel.x * me.timer.tick;

        if(dA[1] < 0) {
            this.player.body.vel.y = dA[1] * this.player.body.maxVel.y * me.timer.tick;
            this.player.body.jumping = true;
        }
    }
}
   
