Chicken.inject(["ChickenVis.UpdateLoop", "Core"],
function (UpdateLoop, Core) {
    "use strict";

    var updater = new UpdateLoop(function (dt) {
        Core.onUpdate(dt);
        Core.onFrame(updater.fps);
    });

    window.onload = function () {
        console.log("Launching Neural Workshop...");
        Core.init(function (ok) {
            if (ok) {
                updater.paused = false;
            }
            else {
                console.error("Failed to load assets");
            }
        });
    }

    window.updateToggle = function () {
        updater.paused = !updater.paused;
    }

});
