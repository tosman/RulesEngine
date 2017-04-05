
const RulesEngine = require('../rule-engine').RunFacts;
var cp = require('child_process');

export const runFact = {
    auth: false,
    handler: async function(request, reply) {
        reply(await RulesEngine(request.payload));
    }
};
