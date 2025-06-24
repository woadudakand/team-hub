// Announcement routes for Fastify
// - Only superadmin or creator can update/delete
// - Create sends announcement to all active members
// - Supports CRUD, pagination, multi-delete, soft delete, restore

const {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    multiDeleteAnnouncements,
    restoreAnnouncement,
    getUnreadAnnouncements,
    markAnnouncementRead,
} = require('../../controllers/announcements');
const {
    isSuperAdminOrCreator,
    isAuthenticated,
} = require('../../plugins/support');

module.exports = async function (fastify, opts) {
    // List announcements with pagination
    fastify.get('/', { preHandler: [isAuthenticated] }, getAnnouncements);

    // Create announcement (send to all active members)
    fastify.post(
        '/',
        { preHandler: [isAuthenticated, isSuperAdminOrCreator] },
        createAnnouncement
    );

    // Update announcement
    fastify.put(
        '/:id',
        { preHandler: [isAuthenticated, isSuperAdminOrCreator] },
        updateAnnouncement
    );

    // Delete announcement (soft delete)
    fastify.delete(
        '/:id',
        { preHandler: [isAuthenticated, isSuperAdminOrCreator] },
        deleteAnnouncement
    );

    // Multi-delete announcements
    fastify.post(
        '/multi-delete',
        { preHandler: [isAuthenticated, isSuperAdminOrCreator] },
        multiDeleteAnnouncements
    );

    // Restore announcement
    fastify.post(
        '/:id/restore',
        { preHandler: [isAuthenticated, isSuperAdminOrCreator] },
        restoreAnnouncement
    );

    // Get unread announcements for dashboard
    fastify.get(
        '/unread',
        { preHandler: [isAuthenticated] },
        getUnreadAnnouncements
    );
    // Mark announcement as read
    fastify.post(
        '/:id/read',
        { preHandler: [isAuthenticated] },
        markAnnouncementRead
    );
};
