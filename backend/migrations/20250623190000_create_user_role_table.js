exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_role', {
    id: 'id',
    role: { type: 'varchar(50)', notNull: true, unique: true },
    deleted: { type: 'boolean', default: false },
  });

  pgm.sql(`
    INSERT INTO user_role (role, deleted) VALUES
      ('superadmin', FALSE),
      ('admin', FALSE),
      ('user', FALSE),
      ('member', FALSE),
      ('subscriber', FALSE)
    ON CONFLICT (role) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('user_role');
};
