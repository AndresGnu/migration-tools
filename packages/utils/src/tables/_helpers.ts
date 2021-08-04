import { MigrationBuilder } from 'node-pg-migrate';
import { CallbackTable } from 'types';
import * as R from 'ramda';

//*******Methors******* */
const getFlatList = <R = any>(
  pgm: MigrationBuilder,
  list: CallbackTable[],
): R[] => {
  //
  const items = list.reduce((prev, current) => {
    return R.flatten(prev.concat(current({ pgm })));
  }, []);
  return items;
};

/**
 *
 */
interface BuildContext<ITEM> {
  pgm: MigrationBuilder;
  item: ITEM;
}

interface OptionsBuild<Item = unknown> {
  up: (options: BuildContext<Item>) => void;
  down: (options: BuildContext<Item>) => void;
}

export const buildUpDown = <Item = unknown>(
  _items: CallbackTable[],
  options: OptionsBuild<Item>,
) => {
  return {
    up: (pgm: MigrationBuilder) => {
      const items = getFlatList(pgm, _items);
      items.forEach((item) => {
        options.up({ item, pgm });
      });
    },
    down: (pgm: MigrationBuilder) => {
      const items = getFlatList(pgm, _items);
      items.forEach((item) => {
        options.down({ item, pgm });
      });
    },
  };
};
