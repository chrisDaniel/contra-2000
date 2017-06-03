
/* ----------------------------------------
 * Players have a pretty finite set of states
 * and can be described across a couple parameters
 *
 * lifecycle ->  0 = spawning
 *               1 = alive
 *               2 = dying
 *               3 = dead
 *
 * direction ->  1 = facing right,
 *              -1 = facing left,
 *
 *
 * activity ->   0 = idle
 *               1 = jumping
 *               2 = running
 *               3 = ducking
 *               4 = looking up
 *               5 = dropping down
 *               6 = falling
 *
 *
 * aiming    ->  1 = Horizontal
 *               2 = Up and Angle
 *               3 = Up
 *               4 = Down and Angle
 *               5 = Down
 *
 *
 *
 * We can take input and update the state based on rules
 * here are the input options
 *
 *      - jumpButton
 *      - upButton
 *      - leftButton
 *      - rightButton
 *      - downButton
 *
 * We can inspect the state and determine some useful values
 * including
 *
 *      - movement vector x, y         -> x,y velocity delta unit vector
 *      - center position              -> for our highlight
 *      - fire vector x, y, vX, vY     -> x,y position of a bullet fired and vector with direction aiming
 *      - animation state              -> what animation to show
 *
 * We also track additional_flags
 *
 *       - flags -> {flagName : timeInValue}
 *
 *       - set with setFlag
 *       - can be anything ... but true false only
 *       - this object keeps up with time on changes
 * -------------------------------------------------*/

function PlayerState(player){

    this.player = player;
    this.lifecycle = 0;
    this.lifecycleTimer = 0;
    this.direction = 1;
    this.activity = 0;
    this.aiming = 1;

    this.forcedTimer = 0;
    this.forcedDuration = 0;

    this.flags = {};

    this.currentInput = new PlayerInput();

    /*--------------------------------
     * Inspect / Calculate
     *--------------------------------*/
    this.calcAccelFactor = function(){

        switch (this.activity) {

            //idle .. ducking ... looking up
            case 0 :
            case 3 :
            case 4 :
                return [0, 0];
                break;

            //jumping
            case 1 :
                var uY = (this.player.body.jumping || this.player.body.falling) ? 0 : -1;
                var uX = (this.currentInput.left || this.currentInput.right) ? this.direction : 0;
                return [uX, uY];
                break;

            //running
            case 2 :
                return [this.direction, 0];
                break;

            //dropping down ... falling
            case 5 :
            case 6 :
                var uX = (this.currentInput.left || this.currentInput.right) ? this.direction : 0;
                return [uX, 0];
                break;

            default :
                return [0, 0];
        }
    };
    this.calcCenterPosition = function(){

        if(this.activity == 3){
            var centerX = this.player.pos.x + (.5 * this.player.width);
            var centerY = this.player.pos.y + (.75 * this.player.height);
            return [centerX, centerY];
        }
        else{
            var centerX = this.player.pos.x + (.5 * this.player.width);
            var centerY = this.player.pos.y + (.5 * this.player.height);
            return [centerX, centerY];
        }
    };
    this.calcBarrelPosition = function(){

        var center = this.calcCenterPosition();

        switch (this.aiming) {

            //horizontal
            case 1 :
                var x = center[0] + (this.direction * .5 * this.player.width);
                var y = center[1];
                var uX = this.direction;
                var uY = 0;
                return [x, y, uX, uY];
                break;

            //up and angle
            case 2 :
                var x = center[0] + (this.direction * .5 * this.player.width);
                var y = this.player.pos.y;
                var uX = this.direction;
                var uY = -1;
                return [x, y, uX, uY];
                break;

            //up
            case 3 :
                var x = center[0] - (.5 * game.constants.Bullet_diameter);
                var y = this.player.pos.y - game.constants.Bullet_diameter;
                var uX = 0;
                var uY = -1;
                return [x, y, uX, uY];
                break;

            //down and angle
            case 4 :
                var x = center[0] + (this.direction * (this.player.width + game.constants.Bullet_diameter));
                var y = this.player.pos.y + this.player.height;
                var uX = this.direction;
                var uY = 1;
                return [x, y, uX, uY];
                break;

            //down
            case 5 :
                var x = center[0] - (.5 * game.constants.Bullet_diameter);
                var y = this.player.pos.y + this.player.height + game.constants.Bullet_diameter;
                var uX = 0;
                var uY = 1;
                return [x, y, uX, uY];
                break;

            default :
                return [0, 0, 0, 0];
        }
    };

    /*--------------------------------
     * Send Change Requests
     *--------------------------------*/
    this.forceState = function(state, forceTime){
        this.lifecycle = state.lifecycle || this.lifecycle;
        this.direction = state.direction || this.direction;
        this.aiming = state.aiming || this.aiming;
        this.activity = state.activity === null ? state.activity : this.activity;

        this.forcedDuration = forceTime || 0;
        this.forcedTimer = 0;
    };
    this.giveInput = function(input) {

        if (input === undefined || input === null) {
            return;
        }
        input.validate();
        this.currentInput.copyFrom(input);
    };
    this.setFlag = function(name, boo, offAfterDt){

        if(!this.flags[name]){
            this.flags[name] = {val : boo, timer : 0, offAfter : 9999999999};
            return;
        }

        if(this.flags[name].val != boo) {
            this.flags[name].val = boo;
            this.flags[name].timer = 0;
        }

        if(offAfterDt > 0){
            this.flags[name].offAfter = offAfterDt;
        }
    };
    this.getFlag = function(name){

        this.flags[name] ? this.flags[name].val : false;
    };
    this.getFlagTimer = function(name){

        this.flags[name] ? this.flags[name].timer : 0;
    };

    /*--------------------------------
     * Send Change Requests
     *--------------------------------*/
    this.updateIt = function(dt){

        //Do These Always
        //Flag / Timers
        this.lifecycleTimer += dt;

        for(var flag in this.flags){
            this.flags[flag].timer += dt;
            if(this.flags[flag].val && this.flags[flag].timer > this.flags[flag].offAfter){
                this.setFlag(flag, false, 999999999);
            }
        }

        //Piece 0...
        //Make sure we are not under strict force
        if(this.forcedDuration > 0) {

            this.forcedTimer += dt;
            if (this.forcedTimer < this.forcedDuration) {
                return;
            }
            else{
                this.forcedTimer = 0;
                this.forcedDuration = 0;
            }
        }


        //Piece 1...
        //Lifecycle (0 = spawning, 1 = alive, 2 = dying, 3 = dead)
        var input = this.currentInput;

        if(this.lifecycle == 0 && (this.lifecycleTimer > game.constants.Player_spawnDuration)){
            this.lifecycle = 1;
            this.lifecycleTimer = 0;
        }
        else if(this.lifecycle == 2 && this.lifecycleTimer > game.constants.Player_dyingDuration){
            this.lifecycle = 3;
            this.lifecycleTimer = 0;
        }
        else if(this.lifecycle == 3 && (this.lifecycleTimer > game.constants.Player_deadDuration)){
            this.lifecycle = 0;
            this.lifecycleTimer = 0;
        }


        //Piece 2...
        //Direction (1 | -1)
        if (input.left == 1){
            this.direction = -1;
        }
        else if(input.right == 1){
            this.direction = 1;
        }

        //Piece 2...
        //Activity (0 = idle, 1 = jumping, 2 = running,  3 = ducking, 4 = lookingup, 5 = dropping down, 6 = falling)
        if(this.player.body.falling){
            this.activity = 6;
        }
        else if(this.player.body.jumping) {
            this.activity = 1;
        }
        else if (input.jump == 1 && this.activity == 3) {
            this.activity = 5;
        }
        else if (input.jump == 1){
            this.activity = 1;
        }
        else if (input.left == 1 || input.right == 1) {
            this.activity = 2;
        }
        else if (input.down == 1) {
            this.activity = 3;
        }
        else if (input.up == 1) {
            this.activity = 4;
        }
        else {
            this.activity = 0;
        }

        //Piece 3...
        //Aiming (1 = horizontal, 2 = up and angle,  3 = up, 4 = down and angle, 5 = down)
        switch (this.activity) {

            //idle or ducking
            case 0 :
            case 3 :
                this.aiming = 1;
                break;

            //looking up
            case 4 :
                this.aiming = 3;
                break;

            //running
            case 2 :
                if (input.up == 1) {
                    this.aiming = 2;
                }
                else if (input.down == 1) {
                    this.aiming = 4;
                }
                else {
                    this.aiming = 1;
                }
                break;

            //jumping or falling
            case 1 :
            case 5 :
            case 6 :
                if (input.up == 1) {
                    if (input.left == 1 || input.right == 1) {
                        this.aiming = 2;
                    }
                    else {
                        this.aiming = 3;
                    }
                }
                else if (input.down == 1) {
                    if (input.left == 1 || input.right == 1) {
                        this.aiming = 4;
                    }
                    else {
                        this.aiming = 5;
                    }
                }
                else {
                    this.aiming = 1;
                }
                break;
        }
    };
}


