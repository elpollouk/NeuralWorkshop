(function () {
"use strict";

var UpdateLoop = Chicken.fetch("ChickenVis.UpdateLoop");
var Loader = Chicken.fetch("ChickenVis.Loader");
var Draw = Chicken.fetch("ChickenVis.Draw");

var updater = new UpdateLoop(onFrame);
var loader = new Loader();
var draw;

var sprites = [
    {
        id: "entity",
        source: "assets/entity-facing.png",
        type: Loader.TYPE_IMAGE
    }
];

function init(callback) {
    draw = new Draw(viewer, 800, 600);
    loader.queue(sprites, function () {
        if (loader.numReady + loader.failed.length === loader.numTotal) {
            callback(loader.failed.length === 0);
        }
    });
}

function onFrame() {
    drawFrame();
}

var x = 50;

function drawFrame() {
    draw.clear();
    draw.rect(10, 10, 280, 130, "rgb(255, 0, 0)");
    draw.circle(20, 20, 20, "rgb(0, 255, 0)");
    draw.image(loader.getData("entity"), x++, 50);
}

window.main = function () {
    console.log("Hello World.");
    init(function (ok) {
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
})();
