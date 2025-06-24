// Fastify DB plugin: exposes fastify.pg.query for use in controllers
'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
    // Decorate fastify.db as a direct query function
    fastify.decorate('db', {
        query: (...args) => fastify.pg.query(...args)
    });
});
