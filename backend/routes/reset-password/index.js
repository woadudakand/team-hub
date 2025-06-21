'use strict';

const { hash } = require('bcryptjs');

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    // Helper to extract .value for multipart fields
    const getValue = v => (v && typeof v === 'object' && 'value' in v ? v.value : v);
    const body = Object.fromEntries(
      Object.entries(request.body || {}).map(([k, v]) => [k, getValue(v)])
    );
    const { token, password } = body;
    if (!token || !password) return reply.code(400).send({ error: 'Token and new password required' });

    try {
      const payload = fastify.jwt.verify(token);
      if (payload.action !== 'reset') throw new Error('Invalid token');

      // Hash new password
      const hashedPassword = await hash(password, 10);
      await fastify.pg.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, payload.id]);
      return { message: 'Password updated successfully' };
    } catch (err) {
      return reply.code(400).send({ error: 'Invalid or expired token' });
    }
  });
};
