exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('team', {
        id: 'id',
        title: { type: 'text', notNull: true },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
    pgm.sql(
        `INSERT INTO team (title, deleted) VALUES ('frontend', false), ('backend', false);`
    );
};

exports.down = (pgm) => {
    pgm.dropTable('team');
};
