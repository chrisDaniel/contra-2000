var commons = commons || {};

commons.calc = {

    randomInt : function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    dxToThing : function (from, target){
        return target.pos.x - from.pos.x;
    },

    dyToThing : function (from, target){
        return from.pos.y - target.pos.y;
    },

    angleToThing : function(from, target) {
        var dy = this.dyToThing(from, target);
        var dx = this.dxToThing(from, target);
        return Math.atan2(dy, dx);
    }
};
