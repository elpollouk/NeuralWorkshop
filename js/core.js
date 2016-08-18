Chicken.register("Core",
["ChickenVis.Loader", "ChickenVis.Draw", "ChickenVis.Math", "Signal.Keyboard", "Signal.Polar", "Signal.Target", "Signal.Wrapped", "NeuralNet", "Entity"],
function (Loader, Draw, Math, signalKb, SignalPolar, SignalTarget, SignalWrapped, NeuralNet, Entity) {
    "use strict";

    var loader = new Loader();
    var draw;

    var signalUp = signalKb.createSignalProvider("ArrowUp");
    var signalLeft = signalKb.createSignalProvider("ArrowLeft");
    var signalRight = signalKb.createSignalProvider("ArrowRight");

    var rotation = 0;
    var dRotation = Math.degreesToRads(1);
    var numCorners = 8;
    var circlePath = [Math.vector2(0, 50)];

    for (var i = 0; i < numCorners; i++) {
        var v = Math.clone2(circlePath[i]);
        Math.rotate2(v, Math.TWO_PI / numCorners);
        circlePath.push(v);
    }

    var assets = [
        {
            id: "entity",
            source: "assets/entity-facing.png",
            type: Loader.TYPE_IMAGE
        }
    ];

    var entity = {};

    var maxExitySpeed = 100;

    var net = new NeuralNet(4, 4, 3);
    net.randomInit();
    for (var neuron of net.signals) {
        neuron.threshold = 0;
        neuron.minValue = 0;
        neuron.maxValue = 1;
    }

    var targeter = new SignalTarget(entity);
    var ent = new Entity();
    ent.attach(targeter);
/*
    ent.signalSteer = new SignalPolar(signalLeft, signalRight);
    ent.signalGo = signalUp;
*/
    var signalPosX = new SignalWrapped(() => ent.pos.x);
    var signalPosY = new SignalWrapped(() => ent.pos.y);
    var signalRotation = new SignalWrapped(() => ent.rotation);

    for (var  i = 0; i < 4; i++) {
        var neuron = net.neurons[i];
        neuron.addInput(targeter.signals[0]);
        neuron.addInput(targeter.signals[1]);
        neuron.addInput(signalPosX);
        neuron.addInput(signalPosY);
        neuron.addInput(signalRotation);
    }

    ent.signalSteer = new SignalPolar(net.signals[0], net.signals[1]);
    ent.signalGo = net.signals[2];

    function drawFrame(fps) {
        draw.clear();
        draw.circle(entity.pos.x, entity.pos.y, 20, "rgb(0, 255, 0)");
        draw.circle(entity.pos.x, entity.pos.y, 20, "black", true);

        ent.render(draw);

        draw.save();
            draw.translate(200, 200);
            draw.rotate(rotation);
            draw.path(circlePath, 'blue');
            draw.image(loader.getData('entity'), -32, -32);
        draw.restore();
        rotation += dRotation;

        var col = signalLeft.value ? "rgb(0, 255, 0)" : "rgba(0, 255, 0, 0.5)";
        draw.rect(315, 10, 50, 50, col);
        col = signalUp.value ? "rgb(255, 0, 0)" : "rgba(255, 0, 0, 0.5)";
        draw.rect(375, 10, 50, 50, col);
        col = signalRight.value ? "rgb(0, 255, 0)" : "rgba(0, 255, 0, 0.5)";
        draw.rect(435, 10, 50, 50, col);

        draw.text(`FPS = ${Math.floor(fps)}`, 0, 0);
    }

    function update(dt) {
        Math.scaleAdd2(entity.pos, entity.velocity, dt);

        if (entity.pos.x < 20) entity.velocity.x *= -1;
        else if (entity.pos.x > 780) entity.velocity.x *= -1;

        if (entity.pos.y < 20) entity.velocity.y *= -1;
        else if (entity.pos.y > 580) entity.velocity.y *= -1;

        net.think();
        ent.update(dt);
    }

    var Core = {
        init: function Core_init(onComplete) {
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

        onFrame: drawFrame,
        onUpdate: update
    };

    return Core;
});
