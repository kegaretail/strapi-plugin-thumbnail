const { webhook } = require('strapi-utils');

module.exports = async () => {
    const { MEDIA_UPDATE, MEDIA_DELETE } = webhook.webhookEvents;

    const thumbnail = strapi.plugins['strapi-plugin-thumbnail'].services.thumbnail;

    strapi.webhookRunner.eventHub.on(MEDIA_DELETE, ({ media }) => {
        thumbnail.delete(media);
    });

    strapi.webhookRunner.eventHub.on(MEDIA_UPDATE, ({ media }) => {
        thumbnail.update(media);
    });

}