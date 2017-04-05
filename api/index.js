
import * as Decision from './handlers/decision-handler';

exports.register = (plugin, options, next) => {
    plugin.route([
        {
            method: 'POST', path: '/worker', config: Decision.runFact
        },
    ]);

    next();
};

exports.register.attributes = { name: 'api' };
