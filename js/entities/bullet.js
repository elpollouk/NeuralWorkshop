Chicken.register("Entity.Bullet", ["ChickenVis.Math"], function (Math) {
	var Bullet = Chicken.Class(function (world, position, velocity, owner, onExpire) {
		this._world = world;
		this._pos = Math.clone2(position);
		this._velocity = Math.clone2(velocity);
		this._owner = owner;
		this._onExpire = onExpire || function () {};

		world.entities.add(this);
	}, {
		update: function (dt) {
			Math.scaleAdd2(this._pos, this._velocity, dt);

			if (this._pos.x < 0 || this._pos.x > this._world.width || this._pos.y < 0 || this._pos.y > this._world.height) {
				this.expire();
			}
			else {
				var d = Math.subAndClone2(this._world.target.pos, this._pos);
				d = Math.lengthSqrd2(d);
				if (d < (20 * 20)) {
					this._owner.score += 1000;
					this.expire();
				}
			}
		},

		render: function (draw) {
			draw.circle(this._pos.x, this._pos.y, 5, "orange");
		},

		expire: function () {
			this._world.entities.remove(this);
			this._onExpire(this._world, this);
		}
	});

	return Bullet;
});