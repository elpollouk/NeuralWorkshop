Chicken.register("Core",
["ChickenVis.Loader", "ChickenVis.Draw", "ChickenVis.Math"],
function (Loader, Draw, Math) {
    "use strict";

    var loader = new Loader();
    var updater;
    var draw;

    var assets = [
        {
            id: "entity",
            source: "assets/entity-facing.png",
            type: Loader.TYPE_IMAGE
        }
    ];

    var entity = {};

    var maxExitySpeed = 100;

    function drawFrame() {
        draw.clear();
        draw.circle(entity.pos.x, entity.pos.y, 20, "rgb(0, 255, 0)");
        draw.circle(entity.pos.x, entity.pos.y, 20, "black", true);

        draw.text(`FPS = ${Math.floor(updater.fps)}`, 0, 0);
    }

    function update(dt) {
        Math.scaleAdd2(entity.pos, entity.velocity, dt);

        if (entity.pos.x < 20) entity.pos.x = 20;
        else if (entity.pos.x > 780) entity.pos.x = 780;

        if (entity.pos.y < 20) entity.pos.y = 20;
        else if (entity.pos.y > 580) entity.pos.y = 580;
    }

    var Core = {
        init: function Core_init(upd, onComplete) {
            updater = upd;
            draw = new Draw(viewer, 800, 600);

            entity.pos = Math.vector2(Math.randomRange(20, 780), Math.randomRange(20, 580));
            entity.velocity = Math.vector2(Math.randomRange(-1, 1), Math.randomRange(-1, 1));
            Math.normalise2(entity.velocity);
            Math.scale2(entity.velocity, maxExitySpeed);

            loader.queue(assets, function () {
                if (loader.numReady + loader.failed.length === loader.numTotal) {
                    onComplete(loader.failed.length === 0);
                }
            });
        },

        update: function Core_update(dt) {
            update(dt);
            drawFrame();
        }
    };

    return Core;
});
