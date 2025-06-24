'use strict';

// Only register the root route here
module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        return { root: true };
    });
};
