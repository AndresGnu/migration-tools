import { singular } from 'pluralize';

export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, (_1: string) => {
    return _1.toUpperCase().replace('-', '').replace('_', '');
  });
};
export function parseTables(table: string) {
  const n = singular(toCamel(table));
  return n.charAt(0).toUpperCase() + n.slice(1);
}

export function getParamName(characters: string) {
  const re = /{{([^}}]+)?}}/g;
  const l = re.exec(characters);
  return l ? l[1] : 'default';
}
