import { useContext } from 'react';
import { StoreContext } from './storeContext';
import type { IRootStore } from '../store/RootStore';

export function useStore(): IRootStore {
  return useContext(StoreContext);
}
