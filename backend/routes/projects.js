// Fastify routes for projects
const projectController = require('../controllers/projects');

async function routes(fastify, opts) {
    fastify.get(
        '/projects',
        { preHandler: [fastify.isAuthenticated] },
        projectController.getProjects
    );
    fastify.post(
        '/projects',
        { preHandler: [fastify.isAuthenticated] },
        projectController.createProject
    );
    fastify.put(
        '/projects/:id',
        { preHandler: [fastify.isAuthenticated] },
        projectController.updateProject
    );
    fastify.delete(
        '/projects/:id',
        { preHandler: [fastify.isAuthenticated] },
        projectController.deleteProject
    );
}

module.exports = routes;
