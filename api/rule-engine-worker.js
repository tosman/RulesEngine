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
for (let i = 0; i < 10000; i++) {
    rules.push({
        client: 'MedStar',
        condition: function(R) {
            var age = getRandomInt(1, 100);
            var client = pv.clients[getRandomInt(-1, pv.clients.length)];
            var authType = pv.authTypes[getRandomInt(-1, pv.authTypes.length)];
            var gender = pv.gender[getRandomInt(-1, pv.gender.length)];

            R.when(
                this &&
                this.client === client &&
                this.authType === authType &&
                pv.procCodes[this.procedureCode] &&
                this.gender === gender &&
                this.age < age
            );
        },
        consequence: function(R) {
            this.result = false;
            R.stop();
        }
    });
}

const rulesEngine = new RuleEngine(rules);

function setupRules(client) {
    rulesEngine.turn('OFF');
    rulesEngine.turn('ON', { client });
}

const RunFact = function(fact) {
    setupRules('MedStar');
    return new Promise((resolve, reject) => {
        rulesEngine.execute(fact, (result, x) => {
            result.approved = !result.result;
            delete result.result;

            resolve(result);
        });
    });
};

process.on('message', (fact) => {
    console.log('hi');
    RunFact(fact).then(function(fact) {
        console.log('test');

        process.send(fact);
    }); ;
});

