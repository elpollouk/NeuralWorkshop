Chicken.register("Core",
["ChickenVis.Loader", "ChickenVis.Draw"],
function (Loader, Draw) {
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

    var x = 50;
    function drawFrame() {
        draw.clear();
        draw.rect(10, 10, 280, 130, "rgb(255, 0, 0)");
        draw.circle(20, 20, 20, "rgb(0, 255, 0)");
        draw.image(loader.getData("entity"), x++, 50);

        draw.text(`FPS = ${Math.floor(updater.fps)}`, 0, 0);
    }

    var Core = {
        init: function Core_init(upd, onComplete) {
            updater = upd;
            draw = new Draw(viewer, 800, 600);
            loader.queue(assets, function () {
                if (loader.numReady + loader.failed.length === loader.numTotal) {
                    onComplete(loader.failed.length === 0);
                }
            });
        },

        update: function Core_update(dt) {
            drawFrame();
        }
    };

    return Core;
});
