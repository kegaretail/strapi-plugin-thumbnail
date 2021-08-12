const fs = require('fs');

// https://sharp.pixelplumbing.com/

module.exports = {

    getThumbnail: async (ctx) => {
        const { thumbnail_key, image_id } = ctx.params;
        const thumbnail = strapi.plugins['thumbnail'].services.thumbnail;

        try {
            const file = await thumbnail.create(thumbnail_key, image_id);

            const src = fs.createReadStream(file.path);
            ctx.response.set("content-type", file.mime);
            ctx.body = src;

        } catch ({ status, error }) {
            ctx.status(status);
            ctx.send(error);
        }
  
    },

};
