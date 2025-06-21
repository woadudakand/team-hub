'use strict';

const { hash } = require('bcryptjs');

module.exports = async function (fastify, opts) {
    fastify.post('/', async function (request, reply) {
        // Helper to extract .value for multipart fields
        const getValue = (v) =>
            v && typeof v === 'object' && 'value' in v ? v.value : v;
        const body = Object.fromEntries(
            Object.entries(request.body || {}).map(([k, v]) => [k, getValue(v)])
        );

        const {
            f_name,
            l_name,
            username,
            email,
            password,
            company,
            role = 'users',
            status = 'in-active',
            deleted = false,
        } = body;

        // Basic validation (expand as needed)
        if (!f_name || !l_name || !username || !email || !password) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        try {
            const { rows } = await fastify.pg.query(
                `INSERT INTO users (f_name, l_name, username, email, password, company, role, status, deleted)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, username, email, role, status, company`,
                [
                    f_name,
                    l_name,
                    username,
                    email,
                    hashedPassword,
                    company,
                    role,
                    status,
                    deleted,
                ]
            );
            // Send registration email
            await fastify.sendMail({
                to: email,
                subject: 'Registration Successful',
                text: `Hello ${f_name}, your registration is complete! Now you can log in with your username: ${username}.`,
                html: `<p>Hello <b>${f_name}</b>, your registration is complete!</p>`,
            });
            return { user: rows[0] };
        } catch (err) {
            if (err.code === '23505') {
                return reply
                    .code(409)
                    .send({ error: 'Username or email already exists' });
            }
            return reply
                .code(500)
                .send({ error: 'Registration failed', details: err.message });
        }
    });
};
