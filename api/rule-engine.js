var _ = require('lodash');
const cluster = require('cluster');

cluster.setupMaster({
    exec: __dirname + '/rule-engine-worker.js',
    silent: false
});

function createWorker(fact) {
    return new Promise((resolve, reject) => {
        var worker = cluster.fork();
        worker.on('message', (m) => {
            resolve(m);
        });

        worker.send(fact);
    });
}

export const RunFacts = function(facts) {
    return Promise.all(_.map(facts, (fact) => createWorker(fact)));
};

