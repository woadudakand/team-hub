'use strict';

module.exports = async function (fastify, opts) {
  fastify.get('/me', { preValidation: [fastify.authenticate] }, async function (request, reply) {
    // The authenticate hook should set request.user from the JWT
    const { id } = request.user;
    // Fetch user info from DB
    const { rows } = await fastify.pg.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [id]
    );
    const user = rows[0];
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    return { user };
  });
};
