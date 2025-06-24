// Fastify routes for project tasks (kanban)
const controller = require('../controllers/tasks');

async function routes(fastify, opts) {
    console.log('isAuthenticated:', typeof fastify.isAuthenticated);
    fastify.get(
        '/projects/:projectId/tasks',
        { preHandler: [fastify.isAuthenticated] },
        controller.getTasks
    );
    fastify.post(
        '/projects/:projectId/tasks',
        { preHandler: [fastify.isAuthenticated] },
        controller.createTask
    );
    fastify.put(
        '/tasks/:id',
        { preHandler: [fastify.isAuthenticated] },
        controller.updateTask
    );
    fastify.delete(
        '/tasks/:id',
        { preHandler: [fastify.isAuthenticated] },
        controller.deleteTask
    );
}

module.exports = routes;
