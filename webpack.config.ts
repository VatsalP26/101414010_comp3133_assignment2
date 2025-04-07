const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'apollo-upload-client': path.resolve(__dirname, 'node_modules/apollo-upload-client/lib/index.mjs'),
    },
  },
};