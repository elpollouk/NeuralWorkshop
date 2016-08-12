(function () {
"use strict";

var drawCtx;
var sprites = {
    entity: "assets/entity-facing.png"
};

function loadAssets(assets, callback) {
    var total = 0;
    var loaded = 0;
    for (var k in assets) {
        if (typeof assets[k] == "string") {
            total++;
            var id = k;
            var img = new Image();
            img.onload = function () {
                loaded++;
                assets[id] = function (x, y, w, h) {
                    w = w || x;
                    h = h || y;
                    drawCtx.drawImage(img, x, y, w, h);
                };

                if (total === loaded) {
                        callback();
                }
            };
            img.src = assets[k];
        }
    }
}

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

function init(callback) {
    drawCtx = viewer.getContext("2d");
    loadAssets(sprites, callback);
}

window.main = function () {
    console.log("Hello World.");
    init(function () {
        rect(10, 10, 280, 130, "rgb(255, 0, 0)");
        circle(20, 20, 20, "rgb(0, 255, 0)");
        sprites.entity(50, 50);
    });
}
})();
