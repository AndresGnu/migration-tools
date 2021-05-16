import { defineType } from '@redware/migration-utils';

export const enum_sign = defineType({ name: 'sign', type: ['+', '-'] });

export const enum_crud = defineType({
  name: 'crud',
  type: ['C', 'R', 'U', 'D'],
});

export const enum_way_to_pay = defineType({
  name: 'way_to_pay',
  type: ['CREDIT', 'COUNTED'],
});
