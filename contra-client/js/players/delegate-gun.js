
function Gun(player, options){

    options = options || {};

    this.player = player;
    this.dtLastFire = 0;
    this.reloadTime = options.reloadTime || game.constants.Player_reloadtime;
    this.reloadPerc = 0;

    this.idle = function (dt) {
        this.dtLastFire += dt;
        this.reloadPerc = Math.min((this.dtLastFire / this.reloadTime), 1);
    };

    this.fire = function (dt) {
        
        if(this.dtLastFire < this.reloadTime){
            this.idle(dt);
            return false;
        }
        
        var fireValues = this.player.playerState.calcBarrelPosition();
        
        var fireX = fireValues[0] - game.constants.Bullet_radius;
        var fireY = fireValues[1] - 2 * game.constants.Bullet_radius;
        var dirX = fireValues[2];
        var dirY = fireValues[3];
        
        game.manager.postBullet(this.player, fireX, fireY, dirX, dirY);
        this.player.playerState.setFlag("shooting", true, 250);
        this.dtLastFire = 0;
        this.reloadPerc = 0;
        return true;
    }
}
   
