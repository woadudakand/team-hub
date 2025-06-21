'use strict';

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    // Helper to extract .value for multipart fields
    const getValue = v => (v && typeof v === 'object' && 'value' in v ? v.value : v);
    const body = Object.fromEntries(
      Object.entries(request.body || {}).map(([k, v]) => [k, getValue(v)])
    );
    const { email } = body;
    if (!email) return reply.code(400).send({ error: 'Email required' });

    // Find user
    const { rows } = await fastify.pg.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return reply.code(200).send({ message: 'If the email exists, a reset link will be sent.' });

    // Generate reset token (JWT, short-lived)
    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, action: 'reset' },
      { expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || '15m' }
    );

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await fastify.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    });

    return { message: 'If the email exists, a reset link will be sent.' };
  });
};
