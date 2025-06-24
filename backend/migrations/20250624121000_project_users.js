exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('project_users', {
        id: { type: 'serial', primaryKey: true },
        project_id: { type: 'integer', notNull: true, references: 'projects(id)', onDelete: 'cascade' },
        user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'cascade' },
        role: { type: 'text', notNull: true, default: 'member' },
        added_at: { type: 'timestamp', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
    });
    pgm.addConstraint('project_users', 'unique_project_user', 'UNIQUE(project_id, user_id)');
};

exports.down = (pgm) => {
    pgm.dropTable('project_users');
};
