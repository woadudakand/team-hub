'use strict';

const path = require('node:path');
const AutoLoad = require('@fastify/autoload');

// Pass --options via CLI arguments in command to enable these options.
const options = {};

module.exports = async function (fastify, opts) {
    fastify.register(import('@fastify/postgres'), {
        connectionString: process.env.DATABASE_URL,
        // Use env vars in real apps
    });
    // Place here your custom code!

    // Register body parser for JSON requests
    fastify.addContentTypeParser(
        'application/json',
        { parseAs: 'string' },
        function (req, body, done) {
            try {
                const json = JSON.parse(body);
                done(null, json);
            } catch (err) {
                err.statusCode = 400;
                done(err, undefined);
            }
        }
    );

    // Register multipart support for file uploads and form-data with fields attached to body
    fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true });

    // Register mailer plugin for sending emails
    fastify.decorate('sendMail', require('./plugins/mailer').sendMail);

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts),
    });
};

module.exports.options = options;
