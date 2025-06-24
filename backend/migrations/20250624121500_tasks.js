exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('tasks', {
        id: { type: 'serial', primaryKey: true },
        project_id: { type: 'integer', notNull: true, references: 'projects(id)', onDelete: 'cascade' },
        title: { type: 'text', notNull: true },
        description: { type: 'text', notNull: false },
        status: { type: 'text', notNull: true, default: 'todo' },
        assignee_id: { type: 'integer', notNull: false, references: 'users(id)', onDelete: 'set null' },
        due_date: { type: 'date', notNull: false },
        sort_order: { type: 'integer', notNull: false },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('tasks');
};
