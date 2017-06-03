
function AIRunner(npc, options){

    options = options || {},
    this.npc = npc;

    this.direction = this.npc.pos.x < (me.game.viewport.width / 2) ? 1 : -1;

    this.input = new PlayerInput();
    this.direction >= 0 ? this.input.right = 1 : this.input.left = 1;

    this.updateIt = function(dt){

        this.npc.playerState.giveInput(this.input);
        this.npc.playerState.updateIt(dt);

        var dA = this.npc.playerState.calcAccelFactor() || [0,0];

        this.npc.body.vel.x = dA[0] * this.npc.body.accel.x * me.timer.tick;

        if(dA[1] < 0) {
            this.npc.body.vel.y = dA[1] * this.npc.body.maxVel.y * me.timer.tick;
            this.npc.body.jumping = true;
        }
    }
}

function AISniper(npc, options){

    options = options || {},
    this.npc = npc;
    this.target = options.target || game.manager.gameState.fpu;

    this.waitToFire = 1000;
    this.waitDt = 0;
    this.fireSeq = 0;

    this.enforceState = {
        action : 0,
        direction : 1,
        aiming : 1,
    };

    this.setTarget = function(target){
        this.target = target;
    };

    this.updateIt = function(dt){

        if(this.target === null){
            return;
        }

        var dx =  commons.calc.dxToThing(this.npc, this.target);
        var angle = commons.calc.angleToThing(this.npc, this.target);

        this.enforceState.direction = dx >= 0 ? 1 : -1;

        //angle will be between PI and -PI
        if(angle <  -Math.PI  * 5/6){
            this.enforceState.aiming = 1;
        }
        else if(angle < -Math.PI  * 1/6){
            this.enforceState.aiming = 4;
        }
        else if(angle < Math.PI  * 1/6){
            this.enforceState.aiming = 1;
        }
        else if(angle < Math.PI  * 5/6){
            this.enforceState.aiming = 2;
        }
        else{
            this.enforceState.aiming = 1;
        }

        this.npc.playerState.forceState(this.enforceState, 99999999);
        this.npc.playerState.updateIt(dt);

        //Shoot!
        //With a random wait between 1000 and 2000
        //Fire 3 bullets quickly
        this.waitDt += dt;
        if(this.waitDt < this.waitToFire) {
            this.npc.gun.idle();
            return;
        }
        if(this.fireSeq >= 3) {
            this.fireSeq = 0;
            this.waitDt = 0;
            this.waitToFire = commons.calc.randomInt(1500, 3300);
        }
        if(this.npc.gun.fire(dt)){
            this.fireSeq++;
        }
    }
}