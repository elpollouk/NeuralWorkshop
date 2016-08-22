Chicken.register("EntityBuilder",
["Signal.Target", "Signal.Cluster", "Signal.Wrapped", "NeuralNet", "Entity.Bug", "RenderAttachment", "Attachment.Gun", "ChickenVis.Math"],
function (SignalTarget, SignalCluster, SignalWrapped, NeuralNet, Bug, RenderAttachment, Gun, Math) {

    var LAYER1 = 4;
    var LAYER2 = 3;
    var LAYER3 = 3;
    var SIGNAL_BIAS = { value: 1, id: "bias" };

    var entities;
    var allTimeBestScore = 0;
    var allTimeBestNet = null;

    var EntityBuilder = {
	    generation: 0,
	    allTimeBestAge: 1,

        constructEntities: function (world, target) {
	        entities = [];
	        for (var i = 0; i < 11; i++)
	            entities.push(EntityBuilder.createBug(world, target));

	        return entities;
	    },

	    nextGeneration: function(world, target, stats) {
	        EntityBuilder.generation++;

	        // Find top scoring entity
	        var bestEnt = entities[0];
	        var bestIndex = 0;
	        var bestScore = bestEnt.score;

	        for (var i = 1; i < entities.length-1; i++) {
	            var ent = entities[i];
	            var score = ent.score;
	            if (score >= bestScore) {
	                bestScore = score;
	                bestEnt = ent;
	                bestIndex = i;
	            }
	        }

	        // Update the states
	        if (bestIndex < 2)
	            stats[4].value++;
	        else if (bestIndex < 4)
	            stats[3].value++;
	        else if (bestIndex < 6)
	            stats[2].value++;
	        else if (bestIndex < 9)
	            stats[1].value++;
	        else
	            stats[0].value++;

	        // Export the best neural net
	        var netData = bestEnt.neuralNet.export();

	        // Update the all time best if needed
	        if (bestScore > (allTimeBestScore / EntityBuilder.allTimeBestAge)) {
	            allTimeBestScore = bestScore;
	            allTimeBestNet = netData;
	            EntityBuilder.allTimeBestAge = 1;
	        }
	        else {
	            EntityBuilder.allTimeBestAge++;
	            allTimeBestScore += entities[entities.length - 1].score;
	        }

	        // Build the all time best entity
	        var allTimeBest = entities[entities.length - 1] = EntityBuilder.createBug(world, target, allTimeBestNet);
	        allTimeBest.attach(new RenderAttachment((draw) => draw.circle(0, 0, 5, "gold")));

	        // Construct the next set of entities
	        for (var i = 0; i < entities.length - 1; i++)
	            entities[i] = EntityBuilder.createBug(world, target, netData);

	        // Mutate the generation
	        // Very mutated
	        entities[0].neuralNet.mutate(0.4, 0.2);
	        entities[0].colour = "red";
	        entities[1].neuralNet.mutate(0.4, 0.2);
	        entities[1].colour = "red";
	        // Quite mutated
	        entities[2].neuralNet.mutate(0.2, 0.2);
	        entities[2].colour = "orange";
	        entities[3].neuralNet.mutate(0.2, 0.2);
	        entities[3].colour = "orange";
	        // Moderately mutated
	        entities[4].neuralNet.mutate(0.1, 0.2);
	        entities[4].colour = "yellow";
	        entities[5].neuralNet.mutate(0.1, 0.2);
	        entities[5].colour = "yellow";
	        // Slightly mutated
	        entities[6].neuralNet.mutate(0.05, 0.2);
	        entities[6].colour = "rgb(127, 255, 127)";
	        entities[7].neuralNet.mutate(0.05, 0.2);
	        entities[7].colour = "rgb(127, 255, 127)";
	        entities[8].neuralNet.mutate(0.05, 0.2);
	        entities[8].colour = "rgb(127, 255, 127)";
	        // Last entity is unmodified from last generation

	        return entities;
	    },

    	createBug: function (world, target, neuralNetData) {
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


	        var ent = new Bug();
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

	            //net.signals[2].threshold = undefined;
	        }

	        ent.signalSteer = net.signals[0];
	        ent.signalGo = net.signals[1];

   	        var gun = new Gun(world, net.signals[2]);
	        ent.attach(gun);


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
	    }
    };

    return EntityBuilder;
});
