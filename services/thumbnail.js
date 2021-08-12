const sharp = require('sharp');
const fs = require('fs');

module.exports = {

    create: async ( thumbnail_key, image_id, force=false ) => {

        return new Promise(async (resolve, reject) => {
            const thumb_base_path = './public/thumbnails';

            if (!fs.existsSync(thumb_base_path)) { fs.mkdirSync(thumb_base_path); }
     
            try {
    
                const thumbnails = strapi.config.get('thumbnails');
                const file = await strapi.plugins.upload.models.file.findOne({_id: image_id});

                if (file && thumbnails[thumbnail_key]) {

                    let actions = [thumbnails[thumbnail_key]];
                    if (Array.isArray(thumbnails[thumbnail_key])) {
                        actions = thumbnails[thumbnail_key];
                    }
                    
                    const { hash, url, ext, mime } = file;
    
                    const thumb_name = hash + ext;
                    const thumb_path = thumb_base_path + '/' + thumbnail_key;
                    const thumb_full_path = thumb_path + '/' + thumb_name;

                    if (!fs.existsSync(thumb_path)) { fs.mkdirSync(thumb_path); }
    
                    if (!fs.existsSync(thumb_full_path) || force) {
                        try {
                            let image = await sharp('./public/'+url);
    
                            //const metadata = await image.metadata();
    
                            for (let i = 0; i < actions.length; i++) {
                                const { type, options } = actions[i];
    
                                if (type === 'resize') {
                                    await image.resize(options);
                                } else if (type === 'extend') {
                                    await image.extend(options);
                                } else if (type === 'extract') {
                                    await image.extract(options);
                                } else if (type === 'trim') {
                                    await image.trim(options);
                                } else if (type === 'rotate') {
                                    const { angle } = actions[i];
                                    
                                    await image.rotate(angle, options);
                                } else if (type === 'flip') {
                                    await image.flip();
                                } else if (type === 'flop') {
                                    await image.flop();
                                } else if (type === 'sharpen') {
                                    const { sigma=0.01, flat=1, jagged=2 } = actions[i];
    
                                    await image.sharpen(sigma, flat, jagged );
                                } else if (type === 'median') {
                                    const { size=3 } = actions[i];
        
                                    await image.median(size);
                                } else if (type === 'blur') {
                                    const { sigma=3 } = actions[i];
                                    
                                    await image.blur(sigma);
                                } else if (type === 'flatten') {
                                    await image.flatten(options);
                                } else if (type === 'gamma') {
                                    const { gamma=2.2, gammaOut=2.2 } = actions[i];
                                     
                                    await image.gamma(gamma, gammaOut);
                                } else if (type === 'tint') {
                                    const { rgb="#000000" } = actions[i];
                                     
                                    await image.tint(rgb);
                                } else if (type === 'toColourspace') {
                                    const { colourspace="rgb" } = actions[i];
    
                                    await image.toColourspace(colourspace);
                                } else if (type === 'removeAlpha') {
                                    await image.removeAlpha();
                                } else if (type === 'greyscale') {
                                    await image.greyscale();
                                }
    
                                
                            }
    
                            await image.toFile(thumb_full_path);
    
                        } catch (error) {
                            reject({ status: 500, error: error});
                        }
                    }

                    resolve({
                        name: thumb_name,
                        path: thumb_full_path,
                        mime: mime
                    });

                } else {
                    reject({ status: 404, error: 'Config or image not found!'});
                }
    
            } catch (error) {
                reject({ status: 500, error: error});
            }

        })
 
    },

    update: async (media) => {
        const { hash, ext, _id } = media;s

        const thumb_base_path = './public/thumbnails';

        const thumbnails = strapi.config.get('thumbnails');

        Object.keys(thumbnails).forEach((thumbnail_key) => {
            const thumb_name = hash + ext;
            const thumb_path = thumb_base_path + '/' + thumbnail_key;
            const thumb_full_path = thumb_path + '/' + thumb_name;

            if (fs.existsSync(thumb_full_path)) {
                strapi.plugins['thumbnail'].services.thumbnail.create(thumbnail_key, _id, true);
            }
        });

    },

    delete: async (media) => {
        const { hash, ext } = media;

        const thumb_base_path = './public/thumbnails';

        const thumbnails = strapi.config.get('thumbnails');

        Object.keys(thumbnails).forEach((thumbnail_key) => {
            const thumb_name = hash + ext;
            const thumb_path = thumb_base_path + '/' + thumbnail_key;
            const thumb_full_path = thumb_path + '/' + thumb_name;

            if (fs.existsSync(thumb_full_path)) {
                fs.unlinkSync(thumb_full_path);
            }
        });

    }

};
