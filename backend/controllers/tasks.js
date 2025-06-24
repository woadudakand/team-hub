// Controller for project tasks (kanban)

exports.getTasks = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { projectId } = req.params;
    const { rows } = await db.query(
        'SELECT * FROM tasks WHERE project_id = $1 AND deleted = false ORDER BY sort_order NULLS LAST, created_at',
        [projectId]
    );
    reply.send(rows);
};

exports.createTask = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { projectId } = req.params;
    const { title, description = '', status = 'todo', assignee_id, due_date, sort_order } = req.body;
    if (!title) return reply.code(400).send({ error: 'Title is required' });
    const { rows } = await db.query(
        'INSERT INTO tasks (project_id, title, description, status, assignee_id, due_date, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [projectId, title, description, status, assignee_id, due_date, sort_order]
    );
    reply.send(rows[0]);
};

exports.updateTask = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { title, description, status, assignee_id, due_date, sort_order } = req.body;
    const { rowCount } = await db.query(
        'UPDATE tasks SET title = $1, description = $2, status = $3, assignee_id = $4, due_date = $5, sort_order = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND deleted = false',
        [title, description, status, assignee_id, due_date, sort_order, id]
    );
    if (!rowCount) return reply.code(404).send({ error: 'Task not found' });
    reply.send({ success: true });
};

exports.deleteTask = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { rowCount } = await db.query(
        'UPDATE tasks SET deleted = true WHERE id = $1',
        [id]
    );
    if (!rowCount) return reply.code(404).send({ error: 'Task not found' });
    reply.send({ success: true });
};
