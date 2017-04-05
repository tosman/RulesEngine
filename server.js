'use strict';

require('babel-register');

const env = require('dotenv').config();
const Glue = require('glue');
const Hapi = require('hapi');
const manifest = require('./config/manifest.json');

if (!process.env.PRODUCTION) {
    manifest.registrations.push({ plugin: {
        register: 'blipp',
        options: {}
    } });
}

var validate = function(decoded, request, callback) {
    // do your checks to see if the person is valid
    console.log('hi');
    return callback(null, !!decoded.id);
};

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
    if (err) {
        console.log('server.register err:', err);
    }

    server.auth.strategy('jwt', 'jwt', true,
        {
            key: process.env.JWT_SECRET,          // Never Share your secret key
            validateFunc: validate,            // validate function defined above
            verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
        });

    server.start(() => {
        console.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
    });
});
