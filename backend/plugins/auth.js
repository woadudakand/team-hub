export default async function (fastify, opts) {
    // app.js or plugins/auth.js
    await fastify.register(import('@fastify/jwt'), {
        secret: 'your-secret-key', // 🔐 Keep this in env vars
    });

    // Add a decorator for verifying JWT
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
}
