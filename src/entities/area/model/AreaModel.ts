import { types } from 'mobx-state-tree';

export const AreaHouseModel = types.model('AreaHouse', {
  address: types.string,
  id: types.string,
});

export const AreaModel = types.model('Area', {
  id: types.identifier,
  number: types.number,
  str_number_full: types.string,
  house: AreaHouseModel,
});

export type IArea = typeof AreaModel.Type;
