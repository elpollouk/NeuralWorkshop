Chicken.register("Entity", ["ChickenVis.Math"], function (Math) {

    var ROTATION_SPEED = Math.degreesToRads(30);
    var ACCELERATION = 20;
    var DRAG = 0.95;

    function rotationToVector(rads, scale) {
        var v = { x: 0, y: -scale };
        Math.rotate2(v, -rads);
        return v;
    }

    var arrowPath = [
        { x: 0, y: -17 },
        { x: 4, y: -10 },
        { x: -4, y: -10 },
        { x: 0, y: -17 }
    ];

    var Entity = Chicken.Class(function () {
        this.rotation = 0;
        this.dRotation = 0;
        this.pos = Math.vector2(400, 300);
        this.velocity = Math.vector2(0, 0);
        this.colour = "rgb(127, 127, 255)";
        this.signalLeft = null;
        this.signalRight = null;
        this.signalGo = null;
        this.sensors = Math.vector2(0, 0);
    }, {
        render: function (draw) {
            draw.save();

            draw.translate(this.pos.x, this.pos.y);
            draw.line(0, 0, this.sensors.x - this.pos.x, this.sensors.y - this.pos.y, "rgba(64, 64, 64, 0.5)");

            draw.rotate(this.rotation);

            draw.circle(0, 0, 20, this.colour);
            draw.circle(0, 0, 20, "black", true);
            draw.path(arrowPath);

            draw.restore();
        },

        _signalsToRoationDelta: function () {
            var l = this.signalLeft.value;
            var r = this.signalRight.value;

            if (l <= r) {
                return r * -ROTATION_SPEED;
            }
            return l * ROTATION_SPEED;
        },

        update: function (dt) {
            this.dRotation -= dt * this._signalsToRoationDelta();
            this.dRotation *= DRAG;
            this.rotation += this.dRotation;

            var dV = rotationToVector(this.rotation, this.signalGo.value * ACCELERATION * dt);
            Math.add2(this.velocity, dV);
            Math.scale2(this.velocity, DRAG);
            Math.add2(this.pos, this.velocity);
            //if (this.rotation < 0.1) this.rotation = 0;

            if (this.pos.x < 20) this.pos.x = 20;
            else if (this.pos.x > 780) this.pos.x = 780;
            if (this.pos.y < 20) this.pos.y = 20;
            else if (this.pos.y > 580) this.pos.y = 580;
        }
    });

    return Entity;
});
