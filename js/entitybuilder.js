Chicken.register("EntityBuilder",
["Signal.Polar", "Signal.Target", "Signal.Wrapped", "NeuralNet", "Entity"],
function (SignalPolar, SignalTarget, SignalWrapped, NeuralNet, Entity) {
    return function EntityBuilder(target, neuralNetData) {
        var targeter = new SignalTarget(target);
        var ent = new Entity();
        ent.attach(targeter);

        var signalPosX = new SignalWrapped(() => ent.pos.x);
        var signalPosY = new SignalWrapped(() => ent.pos.y);
        var signalRotation = new SignalWrapped(() => ent.rotation);

        var net;
        if (neuralNetData) {
            // Imported net, just need to link in the signals
            net = new NeuralNet(neuralNetData);
            for (var  i = 0; i < 4; i++) {
                var neuron = net.neurons[i];
                neuron.inputs[0].signal = targeter.signals[0];
                neuron.inputs[1].signal = targeter.signals[1];
                neuron.inputs[2].signal = signalPosX;
                neuron.inputs[3].signal = signalPosY;
                neuron.inputs[4].signal = signalRotation;
            }
        }
        else {
            // Brand new netwrk so we need to attach signals from scratch
            net = new NeuralNet(4, 4, 3);
            net.randomInit();
            for (var  i = 0; i < 4; i++) {
                var neuron = net.neurons[i];
                neuron.addInput(targeter.signals[0]);
                neuron.addInput(targeter.signals[1]);
                neuron.addInput(signalPosX);
                neuron.addInput(signalPosY);
                neuron.addInput(signalRotation);
            }

            // Set output signal limits
            for (var neuron of net.signals) {
                neuron.threshold = undefined;
                neuron.minValue = 0;
                neuron.maxValue = 1;
            }
        }

        ent.signalSteer = new SignalPolar(net.signals[0], net.signals[1]);
        ent.signalGo = net.signals[2];

        // Punch in the AI
        ent.think = function Entity_think() {
            net.think();
        }
        ent.neuralNet = net;

        return ent;
    };
});
