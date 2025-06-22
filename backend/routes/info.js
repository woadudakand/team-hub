// Fastify plugin for info update APIs with JWT authentication
const bcrypt = require('bcryptjs');

async function infoRoutes(fastify, opts) {
    const db = fastify.pg;

    // Update general_info by user_id
    fastify.put(
        '/general-info/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            const fields = [
                'profile_pic',
                'mailing_address',
                'alternative_address',
                'phone',
                'date_of_birth',
                'gender',
                'social_media_link',
                'cv_file',
                'updated_by',
                'deleted',
            ];
            const userFields = ['f_name', 'l_name'];
            const updates = [];
            const values = [];
            for (const field of fields) {
                if (request.body[field] !== undefined) {
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(request.body[field]);
                }
            }
            values.push(user_id);
            // Update general_info
            let updatedInfo;
            if (updates.length > 0) {
                const { rows } = await db.query(
                    `UPDATE general_info SET ${updates.join(
                        ', '
                    )}, updated_at = NOW() WHERE user_id = $${
                        values.length
                    } RETURNING *`,
                    values
                );
                updatedInfo = rows[0];
                // If no row was updated, insert a new row
                if (!updatedInfo) {
                    // Build insert fields and values
                    const insertFields = fields.filter(
                        (f) => request.body[f] !== undefined
                    );
                    const insertVals = insertFields.map((f) => request.body[f]);
                    insertFields.push('user_id');
                    insertVals.push(user_id);
                    const placeholders = insertVals.map((_, i) => `$${i + 1}`);
                    const { rows: insertRows } = await db.query(
                        `INSERT INTO general_info (${insertFields.join(
                            ', '
                        )}) VALUES (${placeholders.join(', ')}) RETURNING *`,
                        insertVals
                    );
                    updatedInfo = insertRows[0];
                }
            }
            // Update users table for f_name/l_name if present
            const userUpdates = [];
            const userVals = [];
            for (const field of userFields) {
                if (request.body[field] !== undefined) {
                    userUpdates.push(`${field} = $${userVals.length + 1}`);
                    userVals.push(request.body[field]);
                }
            }
            if (userUpdates.length > 0) {
                userVals.push(user_id);
                await db.query(
                    `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${
                        userVals.length
                    }`,
                    userVals
                );
            }
            if (!updates.length && !userUpdates.length)
                return reply.code(400).send({ error: 'No fields to update' });
            reply.send(updatedInfo || {});
        }
    );

    // Update job_info by user_id
    fastify.put(
        '/job-info/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            const fields = [
                'job_title',
                'team_id',
                'salary',
                'date_of_hire',
                'updated_by',
                'deleted',
            ];
            const updates = [];
            const values = [];
            for (const field of fields) {
                if (request.body[field] !== undefined) {
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(request.body[field]);
                }
            }
            values.push(user_id);
            // Update job_info
            let updatedJobInfo;
            if (updates.length > 0) {
                const { rows } = await db.query(
                    `UPDATE job_info SET ${updates.join(
                        ', '
                    )}, updated_at = NOW() WHERE user_id = $${
                        values.length
                    } RETURNING *`,
                    values
                );
                updatedJobInfo = rows[0];
                // If no row was updated, insert a new row
                if (!updatedJobInfo) {
                    const insertFields = fields.filter(
                        (f) => request.body[f] !== undefined
                    );
                    const insertVals = insertFields.map((f) => request.body[f]);
                    insertFields.push('user_id');
                    insertVals.push(user_id);
                    const placeholders = insertVals.map((_, i) => `$${i + 1}`);
                    const { rows: insertRows } = await db.query(
                        `INSERT INTO job_info (${insertFields.join(
                            ', '
                        )}) VALUES (${placeholders.join(', ')}) RETURNING *`,
                        insertVals
                    );
                    updatedJobInfo = insertRows[0];
                }
                reply.send(updatedJobInfo);
            } else {
                return reply.code(400).send({ error: 'No fields to update' });
            }
        }
    );

    // Get user by id
    fastify.get(
        '/users/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            try {
                const { rows } = await db.query(
                    'SELECT * FROM users WHERE id = $1',
                    [user_id]
                );
                if (!rows[0])
                    return reply.code(404).send({ error: 'User not found' });
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get general_info by user_id
    fastify.get(
        '/general-info/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            try {
                const { rows } = await db.query(
                    'SELECT * FROM general_info WHERE user_id = $1',
                    [user_id]
                );
                if (!rows[0]) return reply.send({}); // Return empty object if not found
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get job_info by user_id
    fastify.get(
        '/job-info/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            try {
                const { rows } = await db.query(
                    'SELECT * FROM job_info WHERE user_id = $1',
                    [user_id]
                );
                if (!rows[0]) return reply.send({}); // Return empty object if not found
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Update user account info by user_id
    fastify.put(
        '/account-info/:user_id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { user_id } = request.params;
            const fields = ['username', 'email', 'role']; // password handled separately
            const updates = [];
            const values = [];
            for (const field of fields) {
                if (
                    request.body[field] !== undefined &&
                    request.body[field] !== ''
                ) {
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(request.body[field]);
                }
            }
            // Handle password separately
            let passwordIdx = null;
            if (
                request.body.password !== undefined &&
                request.body.password !== ''
            ) {
                const hashed = await bcrypt.hash(request.body.password, 10);
                updates.push(`password = $${values.length + 1}`);
                values.push(hashed);
                passwordIdx = values.length;
            }
            values.push(user_id);
            if (updates.length === 0)
                return reply.code(400).send({ error: 'No fields to update' });
            try {
                const { rows } = await db.query(
                    `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING id, username, email, role`,
                    values
                );
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get all teams
    fastify.get(
        '/team',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { rows } = await db.query(
                    'SELECT * FROM team WHERE deleted = false OR deleted IS NULL'
                );
                reply.send(rows);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get all user roles
    fastify.get(
        '/user-role',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { rows } = await db.query('SELECT * FROM user_role');
                reply.send(rows);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );
}

module.exports = infoRoutes;
