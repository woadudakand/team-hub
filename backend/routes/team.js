async function teamRoutes(fastify, opts) {
    const db = fastify.pg;

    // Get all teams (original, no search/pagination)
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

    // Get archived teams with search and pagination
    fastify.get(
        '/team-list',
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
                    where += ' AND LOWER(title) LIKE $1';
                    query = `SELECT * FROM team WHERE ${where} ORDER BY id DESC LIMIT $2 OFFSET $3`;
                    countQuery = `SELECT COUNT(*) FROM team WHERE ${where}`;
                    params = [
                        `%${search.toLowerCase()}%`,
                        Number(limit),
                        Number(offset),
                    ];
                } else {
                    query = `SELECT * FROM team WHERE ${where} ORDER BY id DESC LIMIT $1 OFFSET $2`;
                    countQuery = `SELECT COUNT(*) FROM team WHERE ${where}`;
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

    // Delete teams (single or multiple)
    fastify.delete(
        '/team',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return reply
                        .code(400)
                        .send({ error: 'No team ids provided' });
                }
                await db.query(
                    `UPDATE team SET deleted = true WHERE id = ANY($1::int[])`,
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Restore teams (single or multiple)
    fastify.patch(
        '/team/restore',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const ids = request.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return reply
                        .code(400)
                        .send({ error: 'No team ids provided' });
                }
                await db.query(
                    `UPDATE team SET deleted = false WHERE id = ANY($1::int[])`,
                    [ids]
                );
                reply.send({ success: true });
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Create a new team
    fastify.post(
        '/team',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { name } = request.body;
                if (!name) {
                    return reply.code(400).send({ error: 'Team name is required' });
                }
                const { rows } = await db.query(
                    'INSERT INTO team (title, deleted) VALUES ($1, false) RETURNING *',
                    [name]
                );
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );

    // Update a team
    fastify.patch(
        '/team/:id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { name } = request.body;
                if (!name) {
                    return reply.code(400).send({ error: 'Team name is required' });
                }
                const { rows } = await db.query(
                    'UPDATE team SET title = $1 WHERE id = $2 RETURNING *',
                    [name, id]
                );
                if (!rows[0]) return reply.code(404).send({ error: 'Team not found' });
                reply.send(rows[0]);
            } catch (err) {
                reply.code(500).send({ error: err.message });
            }
        }
    );
}

module.exports = teamRoutes;
