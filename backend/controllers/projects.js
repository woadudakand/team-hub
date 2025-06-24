// Project controller logic
// Handles CRUD for projects

exports.getProjects = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    let rows, count;
    if (search) {
        const mainQuery = `SELECT * FROM projects WHERE deleted = false AND name ILIKE $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        const mainParams = [limit, offset, `%${search}%`];
        ({ rows } = await db.query(mainQuery, mainParams));
        const countQuery = `SELECT COUNT(*) FROM projects WHERE deleted = false AND name ILIKE $1`;
        const countParams = [`%${search}%`];
        const countResult = await db.query(countQuery, countParams);
        count = countResult.rows[0].count;
    } else {
        const mainQuery = `SELECT * FROM projects WHERE deleted = false ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        const mainParams = [limit, offset];
        ({ rows } = await db.query(mainQuery, mainParams));
        const countQuery = `SELECT COUNT(*) FROM projects WHERE deleted = false`;
        const countResult = await db.query(countQuery);
        count = countResult.rows[0].count;
    }
    reply.send({ data: rows, total: parseInt(count, 10) });
};

exports.createProject = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { name, description = '', status = 'active' } = req.body;
    if (!name) {
        return reply.code(400).send({ error: 'Project name is required.' });
    }
    const created_by = req.user.id;
    const { rows } = await db.query(
        'INSERT INTO projects (name, description, status, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, status, created_by]
    );
    reply.send(rows[0]);
};

exports.updateProject = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { name, description, status } = req.body;
    const { rowCount } = await db.query(
        'UPDATE projects SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND deleted = false',
        [name, description, status, id]
    );
    if (!rowCount) return reply.code(404).send({ error: 'Project not found' });
    reply.send({ success: true });
};

exports.deleteProject = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { rowCount } = await db.query(
        'UPDATE projects SET deleted = true WHERE id = $1 AND deleted = false',
        [id]
    );
    if (!rowCount) return reply.code(404).send({ error: 'Project not found' });
    reply.send({ success: true });
};
