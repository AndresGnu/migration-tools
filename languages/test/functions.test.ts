import concat_pull_text_search from '../v1.0.0/plv8/functions/concat_pull_text_search';
import { createPlv8 } from '@redware/migration-plv8';

describe('concat_pull_text_search', () => {
  const plv8 = createPlv8();

  test('strings param', () => {
    const r = concat_pull_text_search.run({
      ARGS: {
        texts: ['hola', 'mundo'],
      },
      plv8,
    });
    expect(r).toEqual('hola mundo');
  });

  test('number|string params', () => {
    const r = concat_pull_text_search.run({
      ARGS: {
        texts: ['09', 'mundo'],
      },
      plv8,
    });
    expect(r).toEqual('9 09 mundo');
  });

  test('path|string params', () => {
    const r = concat_pull_text_search.run({
      ARGS: {
        texts: ['1.1', 'mundo'],
      },
      plv8,
    });
    expect(r).toEqual('1.1 1.1 mundo');
  });
});
