Chicken.register("Attachment.Gun", ["Entity.Bullet", "ChickenVis.Math"], function (Bullet, Math) {
	var BULLET_VELOCITY = 600;
	var COOLDOWN_TIME = 2.5;

	var Gun = Chicken.Class(function (world, signalActivate) {
		this.attachedEntity = null;
		this._world = world;
		this._coolDown = 0;
		this._signalActivate = signalActivate;
	}, {
		update: function (dt) {
			this._coolDown -= dt;

			if (this._coolDown <= 0 && this._signalActivate.value > 0.5) {
				var v = Math.vector2(0, BULLET_VELOCITY);
				Math.rotate2(v, -this.attachedEntity.rotation);
				new Bullet(this._world, this.attachedEntity.pos, v, this.attachedEntity);
				this._coolDown = COOLDOWN_TIME;
			}
		},

		render: function () {},
	});

	return Gun;
});