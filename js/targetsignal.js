Chicken.register("Signal.Target", ["ChickenVis.Math"], function (Math) {

    var UP = Math.vector2(0, 1);

    var TargetSignal = Chicken.Class(function (target) {
        this.attachedEntity = null;
        this.targetEntity = target || null;
        this._vectorX = {value:0, id: "targetX" };
        this._vectorY = {value:0, id: "targetY" };
        this._rotation = {value:0, id: "targetDirection" };
        this._distance = {value:0, id: "targetDistance" };
        this.signals = [this._vectorX, this._vectorY, this._rotation, this._distance];
    }, {
        update: function (dt) {
            var targetVector = Math.subAndClone2(this.targetEntity.pos, this.attachedEntity.pos);
            Math.rotate2(targetVector, this.attachedEntity.rotation);
            this._vectorX.value = targetVector.x;
            this._vectorY.value = targetVector.y;
            this._rotation.value = Math.angleBetween2(UP, targetVector);
            this._distance.value = Math.length2(targetVector);
        },

        render: function (draw) {
            //draw.line(0, 0, this._signal0.value, this._signal1.value, "rgba(0, 0, 0, 0.5)");
            //draw.save();
            //draw.rotate(-this._rotation.value);
            //draw.line(0, 0, 0, this._distance.value, "rgba(0, 0, 0, 0.5)");
            //draw.restore();
        },

        registerWithStore: function (signalStore) {
            for (var  i = 0; i < this.signals.length; i++)
                signalStore[this.signals[i].id] = this.signals[i];
        }
    });

    return TargetSignal;
});
