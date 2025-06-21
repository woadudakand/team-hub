// node-pg-migrate configuration file
module.exports = {
    migrationFolder: './migrations',
    direction: 'up',
    logFileName: 'migrations.log',
    databaseUrl:
        process.env.DATABASE_URL ||
        'postgres://user:password@localhost:5432/dbname',
    // You can add more options as needed
};
