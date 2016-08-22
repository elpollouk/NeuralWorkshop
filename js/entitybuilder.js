Chicken.register("EntityBuilder",
["Signal.Polar", "Signal.Target", "Signal.Cluster", "Signal.Wrapped", "NeuralNet", "Entity", "ChickenVis.Math"],
function (SignalPolar, SignalTarget, SignalCluster, SignalWrapped, NeuralNet, Entity, Math) {

    var LAYER1 = 4;
    var LAYER2 = 3;
    var LAYER3 = 2;
    var SIGNAL_BIAS = { value: 1, id: "bias" };

    return function EntityBuilder(world, target, neuralNetData) {
    	// Set up our signals
        var targeter = new SignalTarget(target);
        var rangeCluster = new SignalCluster("distance", targeter.signals[3], 0, 300, 10);
        var signalPosX = new SignalWrapped(() => ent.pos.x);
        var signalPosY = new SignalWrapped(() => ent.pos.y);
        var signalRotation = new SignalWrapped(() => ent.rotation);

        var signalStore = {
        	bias: SIGNAL_BIAS
        };
        targeter.registerWithStore(signalStore);
        rangeCluster.registerWithStore(signalStore);


        var ent = new Entity();
        ent.pos.x = world.width / 2;
        ent.pos.y = world.height / 2;
        ent.attach(targeter);
        ent.attach(rangeCluster);


        var net;
        if (neuralNetData) {
            // Imported net, just need to link in the signals
            net = new NeuralNet(neuralNetData, signalStore);
        }
        else {
            // Brand new network so we need to attach signals from scratch
            net = new NeuralNet(LAYER1, LAYER3);
            for (var  i = 0; i < LAYER1; i++) {
                var neuron = net.neurons[i];
                neuron.addInput(signalStore.bias);
                neuron.addInput(signalStore.targetDirection);

                for (var j = 0; j < rangeCluster.signals.length; j++)
                    neuron.addInput(rangeCluster.signals[i]);
            }
            net.randomInit();

            // Set output signal limits
            //net.signals[0].threshold = undefined;
            net.signals[0].minValue = -1;
            net.signals[0].maxValue = 1;

            //net.signals[1].threshold = undefined;
            net.signals[1].minValue = 0;
            net.signals[1].maxValue = 1;
        }

        ent.signalSteer = net.signals[0];
        //ent.signalSteer = new SignalPolar(net.signals[0], net.signals[1]);
        ent.signalGo = net.signals[1];

        // Punch in the AI
        ent.think = function Entity_think() {
            net.think();
            var distance = targeter.signals[3].value;
            if (distance <= 20)
                ent.score += 50;
            if (distance > 300)
            	ent.score -= 1;
            else {
            	distance /= 30;
            	ent.score += 10 - distance;
            }

            ent._lastDistance = distance;
        }
        ent.neuralNet = net;
        ent.score = 0;
        ent._lastDistance = targeter.signals[3].value;

        return ent;
    };
});
