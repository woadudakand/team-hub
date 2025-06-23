async function userRoleRoutes(fastify, opts) {
    const db = fastify.pg;

    // Get all roles (no search/pagination)
    fastify.get(
        '/user-role',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { rows } = await db.query(
                    'SELECT * FROM user_role WHERE deleted = false OR deleted IS NULL'
                );
                reply.send(rows);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get roles with search and pagination, and archived filter
    fastify.get(
        '/user-role-list',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const {
                    search = '',
                    limit = 10,
                    offset = 0,
                    archived = false,
                } = request.query;
                let where =
                    archived === 'true'
                        ? '(deleted = true)'
                        : '(deleted = false OR deleted IS NULL)';
                let params = [];
                let query, countQuery;
                if (search) {
                    where += ' AND LOWER(role) LIKE $1';
                    query = `SELECT * FROM user_role WHERE ${where} ORDER BY id DESC LIMIT $2 OFFSET $3`;
                    countQuery = `SELECT COUNT(*) FROM user_role WHERE ${where}`;
                    params = [
                        `%${search.toLowerCase()}%`,
                        Number(limit),
                        Number(offset),
                    ];
                } else {
                    query = `SELECT * FROM user_role WHERE ${where} ORDER BY id DESC LIMIT $1 OFFSET $2`;
                    countQuery = `SELECT COUNT(*) FROM user_role WHERE ${where}`;
                    params = [Number(limit), Number(offset)];
                }
                const { rows } = await db.query(query, params);
                const countParams = search ? [params[0]] : [];
                const { rows: countRows } = await db.query(
                    countQuery,
                    countParams
                );
                reply.send({ rows, total: Number(countRows[0].count) });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Create a new role
    fastify.post(
        '/user-role',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { role } = request.body;
                if (!role) {
                    return reply
                        .code(400)
                        .send({ error: 'Role is required' });
                }
                const { rows } = await db.query(
                    'INSERT INTO user_role (role, deleted) VALUES ($1, false) RETURNING *',
                    [role]
                );
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Update a role
    fastify.patch(
        '/user-role/:id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { role } = request.body;
                if (!role) {
                    return reply
                        .code(400)
                        .send({ error: 'Role is required' });
                }
                const { rows } = await db.query(
                    'UPDATE user_role SET role = $1 WHERE id = $2 RETURNING *',
                    [role, id]
                );
                if (!rows[0])
                    return reply.code(404).send({ error: 'Role not found' });
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Soft delete roles (single or multiple)
    fastify.delete(
        '/user-role',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return reply
                        .code(400)
                        .send({ error: 'No role ids provided' });
                }
                await db.query(
                    'UPDATE user_role SET deleted = true WHERE id = ANY($1::int[])',
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Restore roles (single or multiple)
    fastify.patch(
        '/user-role/restore',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return reply
                        .code(400)
                        .send({ error: 'No role ids provided' });
                }
                await db.query(
                    'UPDATE user_role SET deleted = false WHERE id = ANY($1::int[])',
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );
}

module.exports = userRoleRoutes;
