// Controller for project team assignment (project_users)

exports.getProjectUsers = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { projectId } = req.params;
    const { rows } = await db.query(
        `SELECT pu.id, pu.role, pu.added_at, u.id as user_id, u.username, u.email
         FROM project_users pu
         JOIN users u ON pu.user_id = u.id
         WHERE pu.project_id = $1`,
        [projectId]
    );
    reply.send(rows);
};

exports.addProjectUser = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { projectId } = req.params;
    const { user_id, role = 'member' } = req.body;
    await db.query(
        'INSERT INTO project_users (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3',
        [projectId, user_id, role]
    );
    reply.send({ success: true });
};

exports.removeProjectUser = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { projectId, userId } = req.params;
    await db.query(
        'DELETE FROM project_users WHERE project_id = $1 AND user_id = $2',
        [projectId, userId]
    );
    reply.send({ success: true });
};
