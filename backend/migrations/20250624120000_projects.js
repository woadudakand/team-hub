exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('projects', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'text', notNull: true },
        description: { type: 'text', notNull: false },
        status: { type: 'text', notNull: true, default: 'active' },
        created_by: { type: 'integer', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('projects');
};
