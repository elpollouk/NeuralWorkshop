Chicken.register("Core",
["ChickenVis.Loader", "ChickenVis.Draw", "ChickenVis.Math", "EntityBuilder", "ChickenVis.FixedDeltaUpdater", "Graph"],
function (Loader, Draw, Math, entityBuilder, FixedDeltaUpdater, Graph) {
    "use strict";

    var TARGET_SIZE = 20;

    var loader = new Loader();
    var graph = new Graph(5, 60, 150);
    var draw;

    var world = {};

    var assets = [
        {
            id: "entity",
            source: "assets/entity-facing.png",
            type: Loader.TYPE_IMAGE
        }
    ];

    var stats = [
        { value: 0, colour: "rgba(127, 127, 255, 0.75)" },
        { value: 0, colour: "rgba(0, 255, 0, 0.75)" },
        { value: 0, colour: "rgba(255, 255, 0, 0.75)" },
        { value: 0, colour: "rgba(255, 192, 0, 0.75)" },
        { value: 0, colour: "rgba(255, 0, 0, 0.75)" }
    ];

    var entities;
    var target = {};
    var maxTargetSpeed = 100;
    var generationAge = 0;
    var generationPhase = 0;

    var generationTimer = new FixedDeltaUpdater(function () {
        initTarget();
        if (++generationPhase == 6) {
            entities = entityBuilder.nextGeneration(world, target, stats);
            generationAge = 0;
            generationPhase = 0;
        }
    }, 10);

    function drawFrame(fps, warpFactor) {
        draw.clear();
        draw.circle(target.pos.x, target.pos.y, TARGET_SIZE, "rgb(0, 255, 0)");
        draw.circle(target.pos.x, target.pos.y, TARGET_SIZE, "black", true);

        for (var entity of entities) {
            entity.render(draw);
        }

        draw.text(`FPS = ${Math.floor(fps)}`, 5, 5);
        draw.text(`Generation ${entityBuilder.generation}`, 5, 15);
        draw.text(`Generation Age = ${Math.floor(generationAge)}`, 5, 25);
        draw.text(`Warp Factor = ${warpFactor}`, 5, 35);
        draw.text(`All Time Best Age ${entityBuilder.allTimeBestAge}`, 5, 45);
        graph.render(draw, stats);
    }

    function update(dt) {
        Math.scaleAdd2(target.pos, target.velocity, dt);

        if (target.pos.x < TARGET_SIZE) target.velocity.x *= -1;
        else if (target.pos.x > world.width - TARGET_SIZE) target.velocity.x *= -1;

        if (target.pos.y < TARGET_SIZE) target.velocity.y *= -1;
        else if (target.pos.y > world.height - TARGET_SIZE) target.velocity.y *= -1;

        for (var entity of entities) {
            entity.think();
            entity.update(dt);
        }

        generationAge += dt;
        generationTimer.update(dt);
    }

    function initTarget() {
        target.pos = Math.vector2(Math.randomRange(TARGET_SIZE, world.width - TARGET_SIZE), Math.randomRange(TARGET_SIZE, world.height - TARGET_SIZE));
        target.velocity = Math.vector2(Math.randomRange(-1, 1), Math.randomRange(-1, 1));
        Math.normalise2(target.velocity);
        Math.scale2(target.velocity, maxTargetSpeed);
    }

    var Core = {
        init: function Core_init(onComplete) {
            draw = new Draw(viewer, 800, 600);
            Core.onResize();

            entities = entityBuilder.constructEntities(world, target);

            loader.queue(assets, function () {
                if (loader.numReady + loader.failed.length === loader.numTotal) {
                    onComplete(loader.failed.length === 0);
                }
            });
        },

        onResize: function () {
            var width = viewer.clientWidth;
            var height = viewer.clientHeight;
            console.log(`Resizing world to ${width}x${height}`);

            draw.resize(width, height);
            world.width = width;
            world.height = height;

            initTarget();
        },

        onFrame: drawFrame,
        onUpdate: update
    };

    return Core;
});
