'use strict';

const { compare } = require('bcryptjs');

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    // Helper to extract .value for multipart fields
    const getValue = v => (v && typeof v === 'object' && 'value' in v ? v.value : v);
    const body = Object.fromEntries(
      Object.entries(request.body || {}).map(([k, v]) => [k, getValue(v)])
    );

    const { username, email, password } = body;
    if ((!username && !email) || !password) {
      return reply.code(400).send({ error: 'Username/email and password required' });
    }

    // Find user by username or email
    const { rows } = await fastify.pg.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1`,
      [username || '', email || '']
    );
    const user = rows[0];
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Check password
    const valid = await compare(password, user.password);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Sign JWT
    const token = fastify.jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  });
};
