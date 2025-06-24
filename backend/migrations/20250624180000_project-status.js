/**
 * Migration for project_status table
 */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('project_status', {
        id: 'id',
        status: { type: 'varchar(50)', notNull: true, unique: true },
        deleted: { type: 'boolean', default: false },
    });

    pgm.sql(`
    INSERT INTO project_status (status, deleted) VALUES
      ('active', FALSE),
      ('on hold', FALSE),
      ('completed', FALSE),
      ('archived', FALSE)
    ON CONFLICT (status) DO NOTHING;
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('project_status');
};
