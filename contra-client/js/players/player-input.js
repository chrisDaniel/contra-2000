function PlayerInput(){
    this.jump = 0;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;

    this.copyFrom = function(other){

        this.jump = other.jump || 0;
        this.up = other.up || 0;
        this.down = other.down || 0;
        this.left = other.left || 0;
        this.right = other.right || 0;
    };

    this.clearInput = function(){
        this.jump = 0;
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0;
    };

    this.validate = function(){
        this.jump = this.innerValidate(this.jump);
        this.up = this.innerValidate(this.up);
        this.down = this.innerValidate(this.down);
        this.left = this.innerValidate(this.left);
        this.right = this.innerValidate(this.right);

        if(this.up == 1 && this.down == 1){
            this.down = 0;
        }
        if(this.left == 1 && this.right == 1){
            this.left = 0;
        }
    };
    this.innerValidate = function(val){
        if(val === undefined) {
            return 0;
        }
        return (val == 1) ? 1 : 0;
    };
}
