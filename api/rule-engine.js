var _ = require("lodash")
var RuleEngine = require('node-rules');

var propMapper = {
    clients: 'client',
    authTypes: 'authType',
    procCodes: 'procedureCode',
    gender: 'gender'
}

var pv = {
    clients: [
        'IUH',
        'Premier',
        'MedStar',
        'Piedmont',
        'MFC'
    ],
    authTypes: ['Inpatient', 'Outpatient', 'DME'],
    procCodes: [
        'T1002',
        '52005',
        '95807',
        '77085',
        'K0008', 'E0980', 'E1029'],
    gender: ['M', 'F']
}

function ReviewLine(reviewline) {
    _.assign(this, reviewline)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function checkCondition(object, key, condition) {
    return object[key] == condition
}

var rules = [];
for (let i = 0; i < 100000; i++) {

    rules.push({
        "client": "MedStar",
        "condition": function (R) {
            var age = getRandomInt(1, 100);
            var client = pv.clients[getRandomInt(-1, pv.clients.length)];
            var authType = pv.authTypes[getRandomInt(-1, pv.authTypes.length)];
            var procedureCode = pv.procCodes[getRandomInt(-1, pv.procCodes.length)];
            var gender = pv.gender[getRandomInt(-1, pv.gender.length)];

            R.when(this && this.client == client
                && this.authType == authType
                && this.procedureCode == procedureCode
                && this.gender == gender
                && this.age < age);
        },
        "consequence": function (R) {
            this.result = false;
            R.stop();
        }
    })
}


const rulesEngine = new RuleEngine(rules);

function setupRules(client) {
    rulesEngine.turn("OFF")
    rulesEngine.turn("ON", { client })
}

const RunFact = function (fact) {
    return new Promise((resolve, reject) => {
        rulesEngine.execute(fact, (result, x) => {
            result.approved = !result.result;
            delete result.result;

            resolve(result);
        });
    });
}

export const RunFacts = function (facts) {
    setupRules("MedStar"); //TODO: Change to client from somewhere
    return Promise.all(_.map(facts, (fact) => RunFact(fact)));
}

