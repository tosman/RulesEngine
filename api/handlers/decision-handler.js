
const RulesEngine = require('../rule-engine').RunFacts;

export const runFact = {
    auth: false,
    handler: async function (request, reply) {
       reply(await RulesEngine(request.payload));  
    }
}
