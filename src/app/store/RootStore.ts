import { types } from 'mobx-state-tree';
import { MetersStore } from '../../entities/meter';
import { AreasStore } from '../../entities/area';
import { ConfirmModalStore } from '../../shared/model/ConfirmModalStore';

export const RootStore = types.model('RootStore', {
  meters: types.optional(MetersStore, {}),
  areas: types.optional(AreasStore, { cache: {} }),
  modal: types.optional(ConfirmModalStore, {}),
});

export type IRootStore = typeof RootStore.Type;
