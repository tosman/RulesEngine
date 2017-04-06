var _ = require('lodash');
var nools = require("nools");

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

function ReviewLine(review) {
    _.assign(this, review);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var rules = [];
var flow = nools.flow("Hello World", function (flow) {
    for (let i = 0; i < 10000; i++) {
        var age = getRandomInt(1, 100);
        var client = pv.clients[getRandomInt(-1, pv.clients.length)];
        var authType = pv.authTypes[getRandomInt(-1, pv.authTypes.length)];
        var gender = pv.gender[getRandomInt(-1, pv.gender.length)];

        var attrs = {
            client: {
                operator: '==',
                value: client
            },
            age: {
                operator: '<',
                value: age
            },
            authType: {
                operator: '==',
                value: authType
            },
            gender: {
                operator: '==',
                value: gender
            }
        }

        let matchString = generateMatchString(attrs, 'rl');
        //find any message that is exactly hello world
        flow.rule(i, [ReviewLine, "rl", matchString], function (facts) {
            _.assign(facts.rl, { approved: true, matchRule: i })

            // this.halt();
        });
    }
});

function generateMatchString(attrs, objName) {
    return _.reduce(attrs, (result, value, key) => {
        if (!value.value) return result;

        if (result) result += ' && ';
        return result += `${objName}.${key} ${value.operator} "${value.value}"`
    }, '')
}

const RunFact = function (facts) {
    return new Promise((resolve, reject) => {
        let session = flow.getSession();

        _.forEach(facts, (fact) => {
            session.assert(new ReviewLine(fact))
        });

        session.matchUntilHalt().then((someVal) => {
            resolve(facts);
        }, function () {
            resolve(facts);
        });

        resolve(facts);


    });
};

export const RunFacts = function (facts) {
    // return Promise.all(_.map(facts, (fact) => RunFact(fact)));
    return RunFact(facts)
};

