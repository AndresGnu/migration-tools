import { MigrationBuilder } from 'node-pg-migrate';

export default () => {
  return {
    $up: (pgm: MigrationBuilder) => {
      pgm.createExtension('uuid-ossp', { ifNotExists: true });
      pgm.createExtension('ltree', { ifNotExists: true });
      pgm.createExtension('unaccent', { ifNotExists: true });
      pgm.createExtension('plv8', {
        ifNotExists: true,
      });
    },
    $down: (pgm: MigrationBuilder) => {
      pgm.dropExtension('uuid-ossp', { ifExists: true });
      pgm.dropExtension('ltree', { ifExists: true });
      pgm.dropExtension('unaccent', { ifExists: true });
      pgm.dropExtension('plv8', {
        ifExists: true,
      });
    },
  };
};
