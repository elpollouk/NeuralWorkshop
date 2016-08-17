Chicken.inject(["ChickenVis.UpdateLoop", "Core"],
function (UpdateLoop, Core) {
    "use strict";

    var updater = new UpdateLoop(Core.update);

    window.onload = function () {
        console.log("Launching Neural Workshop...");
        Core.init(updater, function (ok) {
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
