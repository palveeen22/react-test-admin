import { createContext } from 'react';
import { RootStore } from '../store/RootStore';
import type { IRootStore } from '../store/RootStore';

export const store = RootStore.create({ areas: { cache: {} } });
export const StoreContext = createContext<IRootStore>(store);
