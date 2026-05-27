import { types } from 'mobx-state-tree';

const MeterAreaRef = types.model('MeterAreaRef', {
  id: types.string,
});

export const MeterModel = types.model('Meter', {
  id: types.identifier,
  _type: types.array(types.string),
  area: MeterAreaRef,
  is_automatic: types.maybeNull(types.boolean),
  description: types.maybeNull(types.string),
  installation_date: types.maybeNull(types.string),
  initial_values: types.array(types.number),
});

export type IMeter = typeof MeterModel.Type;
