// Fastify routes for project team assignment
const controller = require('../controllers/projectUsers');

async function routes(fastify, opts) {
    fastify.get('/projects/:projectId/users', { preHandler: [fastify.isAuthenticated] }, controller.getProjectUsers);
    fastify.post('/projects/:projectId/users', { preHandler: [fastify.isAuthenticated] }, controller.addProjectUser);
    fastify.delete('/projects/:projectId/users/:userId', { preHandler: [fastify.isAuthenticated] }, controller.removeProjectUser);
}

module.exports = routes;
