'use strict';

const fp = require('fastify-plugin');

// JWT-based authentication middleware for Fastify
function isAuthenticated(req, reply, done) {
    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        req.user = req.server.jwt.verify(token);
        done();
    } catch (e) {
        reply.code(401).send({ error: 'Invalid token' });
    }
}

function isSuperAdminOrCreator(req, reply, done) {
    if (
        req.user &&
        (req.user.role === 'superadmin' || req.user.id === req.body.created_by)
    ) {
        done();
    } else {
        reply.code(403).send({ error: 'Forbidden' });
    }
}

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('someSupport', function () {
        return 'hugs';
    });
    fastify.decorate('isAuthenticated', isAuthenticated); // <-- Register as decorator
});

module.exports.isAuthenticated = isAuthenticated;
module.exports.isSuperAdminOrCreator = isSuperAdminOrCreator;
