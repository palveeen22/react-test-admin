import { types, flow } from 'mobx-state-tree';
import { AreaModel } from './AreaModel';
import { httpClient } from '../../../shared/api/httpClient';
import type { AreasResponse } from './types';

export const AreasStore = types
  .model('AreasStore', {
    cache: types.map(AreaModel),
  })
  .volatile(() => ({
    pendingIds: new Set<string>(),
  }))
  .actions((self) => ({
    fetchAreas: flow(function* (ids: string[]) {
      const unknown = [...new Set(ids)].filter(
        (id) => !self.cache.has(id) && !self.pendingIds.has(id)
      );
      if (unknown.length === 0) return;

      unknown.forEach((id) => self.pendingIds.add(id));

      try {
        const data: AreasResponse = yield httpClient.get('/areas/', {
          id__in: unknown,
        });
        data.results.forEach((area) => {
          self.cache.set(area.id, area);
        });
      } finally {
        unknown.forEach((id) => self.pendingIds.delete(id));
      }
    }),
  }));

export type IAreasStore = typeof AreasStore.Type;
