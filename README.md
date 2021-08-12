# Strapi thumbnail plugin

## Installation

**Add plugin package**
```bash
# using yarn
yarn add strapi-plugin-thumbnail

# using npm
npm install strapi-plugin-thumbnail --save
```

**Rebuild Admin Panel**
```bash
# using yarn
yarn build --clean

# using npm
npm run build --clean
```

## Usage

Add `config/thumbnails.js` where u can configurata witch thumbnails can be generated.

```
module.exports = ({ env }) => ({

    desktop: {
        type: 'resize',
        options: {
            width: 782,
            fit: 'contain'
        }
    },

    mobile: {
        type: 'resize',
        options: {
            width: 320,
            height: 160,
            fit: 'cover'
        }
    },
    
    other_thumbnail_name: {
        type: 'greyscale',
    },

});
```

This plugin uses [Sharp](https://sharp.pixelplumbing.com/) to make the thumbnails.

The following functions are available
```
resize
extend
extract
trim
rotate
flip
flop
sharpen
median
blur
flatten
gamma
tint
toColourspace
removeAlpha
greyscale
```
