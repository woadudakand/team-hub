'use strict';
const path = require('node:path');
const fs = require('fs');

module.exports = async function (fastify, opts) {
    // Serve static files for theme
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../files/theme'),
        prefix: '/files/theme/',
    });

    // Get theme settings
    fastify.get('/theme-settings', async (request, reply) => {
        const { rows } = await fastify.pg.query(
            'SELECT * FROM theme_settings ORDER BY id LIMIT 1'
        );
        return rows[0] || {};
    });

    // Upload logo or favicon
    fastify.post('/theme-settings/upload', async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return reply.code(400).send({ error: 'No file uploaded' });
        }
        const { filename, fieldname } = data;
        const ext = path.extname(filename);
        const saveName = `${fieldname}-${Date.now()}${ext}`;
        const savePath = path.join(__dirname, '../files/theme', saveName);
        await fs.promises.writeFile(savePath, await data.toBuffer());
        return { url: `/files/theme/${saveName}` };
    });

    // Update theme settings
    fastify.post('/theme-settings', async (request, reply) => {
        const { logo, favicon, title, tagline, language, mode, direction } =
            request.body;
        const { rows } = await fastify.pg.query(
            `UPDATE theme_settings SET logo = $1, favicon = $2, title = $3, tagline = $4, language = $5, mode = $6, direction = $7, updated_at = NOW() WHERE id = 1 RETURNING *`,
            [logo, favicon, title, tagline, language, mode, direction]
        );
        return rows[0];
    });
};
