#!/usr/bin/env node
/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-var-requires */
require = require('esm')(module);

require('./cli').cli(process.argv);
