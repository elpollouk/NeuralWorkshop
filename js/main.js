(function () {
"use strict";

var UpdateLoop = Chicken.fetch("ChickenVis.UpdateLoop");
var Loader = Chicken.fetch("ChickenVis.Loader");

var updater = new UpdateLoop(onFrame);
var loader = new Loader();

var drawCtx;
var sprites = [
    {
        id: "entity",
        source: "assets/entity-facing.png",
        type: Loader.TYPE_IMAGE
    }
];

function rect(x, y, w, h, c) {
    drawCtx.fillStyle = c;
    drawCtx.fillRect(x, y, w, h);
}

function circle(x, y, r, c) {
    drawCtx.fillStyle = c;
    drawCtx.beginPath();
    drawCtx.arc(x, y, r, 0, Math.PI * 2);
    drawCtx.fill();
}

function image(id, x, y) {
    var img = loader.getData(id);
    drawCtx.drawImage(img, x, y);
}

var x = 50;

function drawFrame() {
    drawCtx.clearRect(0, 0, 800, 600);
    rect(10, 10, 280, 130, "rgb(255, 0, 0)");
    circle(20, 20, 20, "rgb(0, 255, 0)");
    image("entity", x++, 50);
}


function init(callback) {
    drawCtx = viewer.getContext("2d");
    loader.queue(sprites, function () {
        if (loader.numReady + loader.failed.length === loader.numTotal) {
            callback(loader.failed.length === 0);
        }
    });
}

function onFrame() {
    drawFrame();
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
