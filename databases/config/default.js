const { envPath } = require('@redware/js-utils');
const d = require('dotenv').config({ path: envPath() });
module.exports = {
  url: d.parsed.PG_BASE + '/' + d.parsed.PG_DATABASE,
};
