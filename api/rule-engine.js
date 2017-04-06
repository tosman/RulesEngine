var _ = require('lodash');
var RuleEngine = require('node-rules');

var pv = {
    clients: [
        'IUH',
        'Premier',
        'MedStar',
        'Piedmont',
        'MFC'
    ],
    authTypes: ['Inpatient', 'Outpatient', 'DME'],
    procCodes: {
        T1002: 1,
        52005: 1,
        95807: 1,
        77085: 1,
        K0008: 1,
        E0980: 1,
        E1029: 1
    },
    gender: ['M', 'F']
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var rules = [];
_.forEach(pv.clients, (client) => {
    for (let i = 0; i < 1000; i++) {
        rules.push({
            client: client,
            condition: function (R) {
                var pc = {
                    T1002: 1,
                    52005: 1,
                    95807: 1,
                    77085: 1,
                    K0008: 1,
                    E0980: 1,
                    E1029: 1
                }
                var age = getRandomInt(1, 100);
                var client = pv.clients[getRandomInt(-1, pv.clients.length)];
                var authType = pv.authTypes[getRandomInt(-1, pv.authTypes.length)];
                var gender = pv.gender[getRandomInt(-1, pv.gender.length)];

                R.when(
                    this &&
                    this.client === client &&
                    this.authType === authType &&
                    pc[this.procedureCode] &&
                    this.gender === gender &&
                    this.age < age
                );
            },
            consequence: function (R) {
                this.result = false;
                R.stop();
            }
        });
    }
});

const rulesEngine = new RuleEngine(rules);

function setupRules(client) {
    rulesEngine.turn('OFF');
    rulesEngine.turn('ON', { client });
}

const RunFact = function (fact) {
    return new Promise((resolve, reject) => {
        rulesEngine.execute(fact, (result, x) => {
            result.approved = !result.result;
            delete result.result;

            resolve(result);
        });
    });
};

export const RunFacts = function (facts) {
    setupRules('MedStar'); // TODO: Change to client from somewhere
    return Promise.all(_.map(facts, (fact) => RunFact(fact)));
};

