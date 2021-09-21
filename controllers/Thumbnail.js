const fs = require('fs');

// https://sharp.pixelplumbing.com/

module.exports = {

    getThumbnail: async (ctx) => {
        const { thumbnail_key, image_id } = ctx.params;
        const thumbnail = strapi.plugins['thumbnail'].services.thumbnail;

        try {
            const file = await thumbnail.create(thumbnail_key, image_id);

            const src = fs.createReadStream(file.path);
            ctx.response.set('content-type', file.mime);
            ctx.response.set('cache-control', 'max-age=0');
            ctx.body = src;

        } catch ({ status=500, error }) {
            ctx.send(error, status);
        }
  
    },

};
