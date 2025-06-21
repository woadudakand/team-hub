'use strict';

module.exports = async function (fastify, opts) {
    try {
        const client = await fastify.pg.connect();
        fastify.get('/', async function (request, reply) {
            return 'this is an example';
        });
        console.log('database successfully connected');
    } catch (error) {
        console.log(error);
    }
};
