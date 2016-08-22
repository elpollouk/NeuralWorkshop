Chicken.register("Entity.EntityGroup", [], function () {

	var EntityGroup = Chicken.Class(function () {
		this._entities = [];
	}, {
		add: function (entities) {
			if (!Array.isArray(entities))
				entities = [ entities ];

			for (var i = 0; i < entities.length; i++)
				this._entities.push(entities[i]);
		},

		remove: function (entities) {
			if (!Array.isArray(entities))
				entities = [ entities ];

			for (var i = 0; i < entities.length; i++)
				for (var j = 0; j < this._entities.length; j++)
					if (entities[i] === this._entities[j])
						this._entities.splice(j, 1);
		},

		clear: function () {
			this._entities = [];
		},

		forEach: function (func) {
			for (var i = 0; i < this._entities.length; i++)
				func(this._entities[i]);
		},

		update: function (dt) {
			for (var i = 0; i < this._entities.length; i++)
				this._entities[i].update(dt);
		},

		render: function (draw) {
			for (var i = 0; i < this._entities.length; i++)
				this._entities[i].render(draw);
		}
	}, {
		count: {
            get: function () {
                return this._entities.length;
            },
            enumerable: true
        }
	});

	return EntityGroup;
});