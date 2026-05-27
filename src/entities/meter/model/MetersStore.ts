import { types, flow, getRoot, applySnapshot, getSnapshot } from 'mobx-state-tree';
import { MeterModel } from './MeterModel';
import { httpClient } from '../../../shared/api/httpClient';
import { METERS_PER_PAGE } from '../../../shared/config/constants';
import type { MetersResponse } from './types';
import type { IAreasStore } from '../../area';

export const MetersStore = types
  .model('MetersStore', {
    items: types.array(MeterModel),
    count: types.optional(types.number, 0),
    offset: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, true),
    isDeleting: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    _abortCtrl: null as AbortController | null,
  }))
  .views((self) => ({
    get currentPage() {
      return Math.floor(self.offset / METERS_PER_PAGE) + 1;
    },
    get totalPages() {
      return Math.ceil(self.count / METERS_PER_PAGE);
    },
  }))
  .actions((self) => {
    const silentRefetch = flow(function* (signal?: AbortSignal) {
      const data: MetersResponse = yield httpClient.get(
        '/meters/',
        { limit: METERS_PER_PAGE, offset: self.offset },
        signal
      );
      self.count = data.count;
      applySnapshot(self.items, data.results);
      const areaIds = data.results.map((m) => m.area.id);
      const root = getRoot<{ areas: IAreasStore }>(self);
      yield root.areas.fetchAreas(areaIds);
    });

    const fetchMeters = flow(function* (offset: number) {
      self._abortCtrl?.abort();
      const ctrl = new AbortController();
      self._abortCtrl = ctrl;

      self.isLoading = true;
      self.offset = offset;
      try {
        yield silentRefetch(ctrl.signal);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
      } finally {
        if (self._abortCtrl === ctrl) {
          self.isLoading = false;
        }
      }
    });

    const deleteMeter = flow(function* (id: string) {
      const index = self.items.findIndex((m) => m.id === id);
      const snapshot = index >= 0 ? getSnapshot(self.items[index]) : null;

      self.isDeleting = true;
      if (index >= 0) self.items.splice(index, 1);

      try {
        yield httpClient.del(`/meters/${id}/`);
        yield silentRefetch();
      } catch {
        if (snapshot !== null && index >= 0) {
          self.items.splice(index, 0, snapshot as never);
        }
      } finally {
        self.isDeleting = false;
      }
    });

    const goToPage = (page: number) => {
      fetchMeters((page - 1) * METERS_PER_PAGE);
    };

    return { fetchMeters, deleteMeter, goToPage };
  });

export type IMetersStore = typeof MetersStore.Type;
