/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        f_name: { type: 'varchar(255)', notNull: true },
        l_name: { type: 'varchar(255)', notNull: true },
        username: { type: 'varchar(255)', notNull: true, unique: true },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        company: { type: 'varchar(255)', notNull: false },
        role: { type: 'varchar(20)', notNull: true, default: 'users' }, // superadmin, admin, users, subscriber
        status: { type: 'varchar(10)', notNull: true, default: 'in-active' }, // in-active, active
        deleted: { type: 'boolean', notNull: true, default: false },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users');
};
