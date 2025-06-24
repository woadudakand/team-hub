async function projectStatusRoutes(fastify, opts) {
    const db = fastify.pg;

    // Get all statuses (no search/pagination)
    fastify.get(
        '/project-status',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { rows } = await db.query(
                    'SELECT * FROM project_status WHERE deleted = false OR deleted IS NULL'
                );
                reply.send(rows);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Get statuses with search and pagination, and archived filter
    fastify.get(
        '/project-status-list',
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
                    where += ' AND LOWER(status) LIKE $1';
                    query = `SELECT * FROM project_status WHERE ${where} ORDER BY id DESC LIMIT $2 OFFSET $3`;
                    countQuery = `SELECT COUNT(*) FROM project_status WHERE ${where}`;
                    params = [
                        `%${search.toLowerCase()}%`,
                        Number(limit),
                        Number(offset),
                    ];
                } else {
                    query = `SELECT * FROM project_status WHERE ${where} ORDER BY id DESC LIMIT $1 OFFSET $2`;
                    countQuery = `SELECT COUNT(*) FROM project_status WHERE ${where}`;
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

    // Add status
    fastify.post(
        '/project-status',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { status } = request.body;
                await db.query(
                    'INSERT INTO project_status (status) VALUES ($1) ON CONFLICT (status) DO NOTHING',
                    [status]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Update status
    fastify.patch(
        '/project-status/:id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { status } = request.body;
                await db.query(
                    'UPDATE project_status SET status = $1 WHERE id = $2',
                    [status, id]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Soft delete
    fastify.delete(
        '/project-status',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { ids } = request.body;
                await db.query(
                    'UPDATE project_status SET deleted = true WHERE id = ANY($1::int[])',
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Restore
    fastify.patch(
        '/project-status/restore',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { ids } = request.body;
                await db.query(
                    'UPDATE project_status SET deleted = false WHERE id = ANY($1::int[])',
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );
}

module.exports = projectStatusRoutes;
