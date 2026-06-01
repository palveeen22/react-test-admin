import { types, flow, applySnapshot, getSnapshot } from 'mobx-state-tree';
import { MeterModel } from './MeterModel';
import { httpClient, getHttpErrorMessage } from '../../../shared/api/httpClient';
import { METERS_PER_PAGE } from '../../../shared/config/constants';
import type { MetersResponse } from './types';

export const MetersStore = types
  .model('MetersStore', {
    items: types.array(MeterModel),
    count: types.optional(types.number, 0),
    offset: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, true),
    isDeleting: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    deleteError: types.maybeNull(types.string),
  })
  .volatile(() => ({
    _abortCtrl: null as AbortController | null,
    _deleteErrorTimer: null as ReturnType<typeof setTimeout> | null,
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
    });

    const fetchMeters = flow(function* (offset: number) {
      self._abortCtrl?.abort();
      const ctrl = new AbortController();
      self._abortCtrl = ctrl;

      self.isLoading = true;
      self.error = null;
      self.offset = offset;
      try {
        yield silentRefetch(ctrl.signal);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        self.error = getHttpErrorMessage(e);
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

      self.deleteError = null;
      try {
        yield httpClient.del(`/meters/${id}/`);
        yield silentRefetch();
      } catch (e) {
        if (snapshot !== null && index >= 0) {
          self.items.splice(index, 0, snapshot as never);
        }
        self.deleteError = getHttpErrorMessage(e);
        if (self._deleteErrorTimer) clearTimeout(self._deleteErrorTimer);
        self._deleteErrorTimer = setTimeout(() => {
          self.deleteError = null;
        }, 5000);
      } finally {
        self.isDeleting = false;
      }
    });

    const retryFetch = () => {
      fetchMeters(self.offset);
    };

    const goToPage = (page: number) => {
      fetchMeters((page - 1) * METERS_PER_PAGE);
    };

    function beforeDestroy() {
      self._abortCtrl?.abort();
      if (self._deleteErrorTimer) clearTimeout(self._deleteErrorTimer);
    }

    return { fetchMeters, retryFetch, deleteMeter, goToPage, beforeDestroy };
  });

export type IMetersStore = typeof MetersStore.Type;
