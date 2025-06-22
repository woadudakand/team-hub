exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('general_info', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        profile_pic: { type: 'text' },
        mailing_address: { type: 'text' },
        alternative_address: { type: 'text' },
        phone: { type: 'text' },
        date_of_birth: { type: 'date' },
        gender: { type: 'text' },
        social_media_link: { type: 'text' },
        cv_file: { type: 'text' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        created_by: {
            type: 'integer',
            references: 'users',
            onDelete: 'set null',
        },
        updated_by: {
            type: 'integer',
            references: 'users',
            onDelete: 'set null',
        },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
    pgm.createIndex('general_info', 'user_id');

    pgm.createTable('job_info', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        job_title: { type: 'text' },
        team_id: {
            type: 'integer',
            references: 'team',
            onDelete: 'set null',
        },
        salary: { type: 'numeric' },
        date_of_hire: { type: 'date' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        created_by: {
            type: 'integer',
            references: 'users',
            onDelete: 'set null',
        },
        updated_by: {
            type: 'integer',
            references: 'users',
            onDelete: 'set null',
        },
        deleted: { type: 'boolean', notNull: true, default: false },
    });
    pgm.createIndex('job_info', 'user_id');
    pgm.createIndex('job_info', 'team_id');
};

exports.down = (pgm) => {
    pgm.dropTable('job_info');
    pgm.dropTable('general_info');
};
