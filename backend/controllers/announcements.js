// Announcement controller logic
// Handles CRUD, pagination, multi-delete, soft delete, restore

const { sendMail } = require('../plugins/mailer');

// List announcements with pagination
exports.getAnnouncements = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { page = 1, limit = 10, search = '' } = req.query;

    const offset = (page - 1) * limit;
    let rows, count;
    if (search) {
        // When searching, use $3 for main query, $1 for count query
        const mainQuery = `SELECT * FROM announcements WHERE deleted = false AND (title ILIKE $3 OR description ILIKE $3) ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        const mainParams = [limit, offset, `%${search}%`];
        ({ rows } = await db.query(mainQuery, mainParams));
        const countQuery = `SELECT COUNT(*) FROM announcements WHERE deleted = false AND (title ILIKE $1 OR description ILIKE $1)`;
        const countParams = [`%${search}%`];
        const countResult = await db.query(countQuery, countParams);
        count = countResult.rows[0].count;
    } else {
        const mainQuery = `SELECT * FROM announcements WHERE deleted = false ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        const mainParams = [limit, offset];
        ({ rows } = await db.query(mainQuery, mainParams));
        const countQuery = `SELECT COUNT(*) FROM announcements WHERE deleted = false`;
        const countResult = await db.query(countQuery);
        count = countResult.rows[0].count;
    }
    reply.send({ data: rows, total: parseInt(count, 10) });
};

// Create announcement and notify all active members
exports.createAnnouncement = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { title, description, files = '' } = req.body;
    if (!title || !description) {
        return reply.code(400).send({ error: 'Title and description are required.' });
    }
    const created_by = req.user.id;
    const { rows } = await db.query(
        'INSERT INTO announcements (title, description, created_by, files, deleted) VALUES ($1, $2, $3, $4, false) RETURNING *',
        [title, description, created_by, files]
    );
    // Send to all active members except creator, and only if deleted = 0
    const { rows: users } = await db.query(
        'SELECT email, id FROM users WHERE status = $1 AND deleted = false AND id <> $2',
        ['active', created_by]
    );
    for (const user of users) {
        await sendMail({
            to: user.email,
            subject: `New Announcement: ${title}`,
            text: description,
        });
    }
    reply.send(rows[0]);
};

// Update announcement
exports.updateAnnouncement = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { title, description, files = '' } = req.body;
    if (!title || !description) {
        return reply.code(400).send({ error: 'Title and description are required.' });
    }
    // Only superadmin or creator can update
    const { rowCount } = await db.query(
        'UPDATE announcements SET title = $1, description = $2, files = $3 WHERE id = $4 AND (created_by = $5 OR $6 = true) AND deleted = false',
        [title, description, files, id, req.user.id, req.user.role === 'superadmin']
    );
    if (!rowCount) return reply.code(403).send({ error: 'Forbidden' });
    reply.send({ success: true });
};

// Soft delete announcement
exports.deleteAnnouncement = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    const { rowCount } = await db.query(
        'UPDATE announcements SET deleted = true WHERE id = $1 AND (created_by = $2 OR $3 = true) AND deleted = false',
        [id, req.user.id, req.user.role === 'superadmin']
    );
    if (!rowCount) return reply.code(403).send({ error: 'Forbidden' });
    reply.send({ success: true });
};

// Multi-delete announcements
exports.multiDeleteAnnouncements = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length)
        return reply.code(400).send({ error: 'No IDs provided' });
    await db.query(
        'UPDATE announcements SET deleted = true WHERE id = ANY($1) AND (created_by = $2 OR $3 = true) AND deleted = false',
        [ids, req.user.id, req.user.role === 'superadmin']
    );
    reply.send({ success: true });
};

// Restore announcement
exports.restoreAnnouncement = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const { id } = req.params;
    await db.query('UPDATE announcements SET deleted = false WHERE id = $1', [id]);
    reply.send({ success: true });
};

// Get unread announcements for current user (dashboard)
exports.getUnreadAnnouncements = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const userId = req.user.id;
    // read_by is a comma-separated string of user IDs (or JSON/text array)
    const { rows } = await db.query(
        `SELECT * FROM announcements WHERE deleted = false AND (read_by IS NULL OR read_by = '' OR POSITION(','||$1||',' IN ','||read_by||',') = 0) ORDER BY created_at DESC`,
        [userId.toString()]
    );
    reply.send(rows);
};

// Mark announcement as read by current user
exports.markAnnouncementRead = async (req, reply) => {
    const db = req.server.db || req.server.pg;
    const userId = req.user.id;
    const { id } = req.params;
    // Add userId to read_by (comma-separated string)
    await db.query(
        `UPDATE announcements SET read_by =
            CASE WHEN read_by IS NULL OR read_by = '' THEN $1
                 ELSE read_by || ',' || $1 END
         WHERE id = $2`,
        [userId.toString(), id]
    );
    reply.send({ success: true });
};
