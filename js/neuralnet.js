Chicken.register("NeuralNet", ["Neuron"], function (Neuron) {

    function buildNet(layers) {
        var net = [];
        var prevLayerStart = 0;
        var prevLayerEnd = 0;

        for (var count of layers) {
            for (var i = 0; i < count; i++) {
                var neuron = new Neuron();
                for (var j = prevLayerStart; j < prevLayerEnd; j++) {
                    neuron.addInput(net[j]);
                }
                net.push(neuron);
            }
            prevLayerStart = prevLayerEnd;
            prevLayerEnd = net.length;
        }

        return net;
    }

    var NeuralNet = Chicken.Class(function () {
        this.neurons = buildNet(arguments);

        this.signals = [];
        for (var i = this.neurons.length - arguments[arguments.length-1]; i < this.neurons.length; i++)
            this.signals.push(this.neurons[i]);
    }, {
        randomInit: function () {
            for (var n of this.neurons)
                n.randomInit();
        },

        think: function () {
            for (var n of this.neurons)
                n.think();
        },

        mutate: function (chance, delta) {
            for (var n of this.neurons)
                n.mutate(chance, delta);
        }
    });

    return NeuralNet;
});
