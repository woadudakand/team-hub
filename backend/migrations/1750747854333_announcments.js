exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('announcements', {
        id: { type: 'serial', primaryKey: true },
        title: { type: 'text', notNull: true },
        description: { type: 'text', notNull: true },
        start_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('CURRENT_DATE'),
        },
        end_date: { type: 'date', notNull: false },
        created_by: { type: 'integer', notNull: true },
        share_with: { type: 'text', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        files: { type: 'text', notNull: true },
        read_by: { type: 'text', notNull: false },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('announcements');
};
