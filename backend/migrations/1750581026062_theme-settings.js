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
  pgm.createTable('theme_settings', {
    id: { type: 'serial', primaryKey: true },
    logo: { type: 'text', notNull: false },
    favicon: { type: 'text', notNull: false },
    title: { type: 'text', notNull: false },
    tagline: { type: 'text', notNull: false },
    language: { type: 'text', notNull: false, default: 'en' },
    mode: { type: 'text', notNull: false, default: 'light' },
    direction: { type: 'text', notNull: false, default: 'ltr' },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.sql(`INSERT INTO theme_settings (logo, favicon, title, tagline, language, mode, direction) VALUES ('', '', '', '', 'en', 'light', 'ltr') ON CONFLICT DO NOTHING`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('theme_settings');
};
